const reqlib = require('app-root-path').require
const { google } = require('googleapis')
const { Readable } = require('stream')
const { sendMessage } = reqlib('discord_bot')
const { SyllabusStatus } = reqlib('constants')
const Class = reqlib('models/class')
require('dotenv').config()

exports.uploadSyllabus = async (user, classId, file, comment) => {
  const client = google.auth.fromJSON({
    type: 'authorized_user',
    client_id: process.env.DRIVE_UPLOADER_CLIENT_ID,
    client_secret: process.env.DRIVE_UPLOADER_CLIENT_SECRET,
    refresh_token: process.env.DRIVE_UPLOADER_REFRESH_TOKEN,
  })

  const drive = google.drive({version: 'v3', auth: client})

  try {
    const classFolderId = await createFolderIfNotExist(drive, process.env.DRIVE_UPLOADER_ASSIGNHUB_FOLDER_ID, classId)
    const userFolderId = await createFolderIfNotExist(drive, classFolderId, user.email)
    await uploadFile(drive, userFolderId, file)
    sendMessage(`${user.firstName} ${user.lastName} (${user.email}) has uploaded a syllabus!\`\`\`Class ID: ${classId}\nName: "${file.name}"\nComment: "${comment}"\`\`\``)

    setSyllabusStatus(classId, SyllabusStatus.UPLOADED);
  } catch (err) {
    throw err
  }
}

const uploadFile = async (drive, folderId, file) => {
  const fileMetadata = {
    name: file.name,
    parents: [folderId],
  }
  const media = {
    mimeType: file.mimetype,
    body: Readable.from(file.data),
  }

  try {
    await drive.files.create({
      resource: fileMetadata,
      media: media,
    })
  } catch (err) {
    throw err
  }
}

// Creates the specified folder if it doesn't exist and returns the folder id
const createFolderIfNotExist = async (drive, parentFolderId, folderName) => {
  try {
    // Check if folder exists
    const res = await drive.files.list({
      q: `'${parentFolderId}' in parents and mimeType='application/vnd.google-apps.folder' and name='${folderName}'`,
      spaces: 'drive',
    })

    // Return folder id if exists
    if (res.data.files.length > 0) {
      return res.data.files[0].id
    }

    // Create folder if it doesn't exist
    const fileMetadata = {
      name: folderName,
      parents: [parentFolderId],
      mimeType: 'application/vnd.google-apps.folder',
    }
    const folder = await drive.files.create({
      resource: fileMetadata,
      fields: 'id',
    })
    return folder.data.id
  } catch (err) {
    throw err
  }
}

exports.setSyllabusStatus = async (classId, syllabusStatus) => {
  await Class.findByIdAndUpdate(classId, { syllabusStatus })
}