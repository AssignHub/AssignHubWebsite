exports.splitLongMessage = (message, surroundString="") => {
  /* Returns an array containing the separate messages to send when a 
   * single message is too long (>2000 characters).
   * Each message in the array will be surrounded by surroundString (e.g. "```")
   */
  
  let charLimit = 2000
  charLimit -= surroundString.length*2
  const messageArray = []

  // Go through message and keep substringing it in 2000 character chunks,
  // and add the chunks to the messageArray
  while (message.length > charLimit) {
    // Split at the last newline before the character limit, or the character limit 
    // if newline was not found
    let splitIndex = message.lastIndexOf('\n', charLimit)
    if (splitIndex === -1) splitIndex = charLimit

    messageArray.push(surroundString + message.substring(0, splitIndex) + surroundString)
    if (message[splitIndex] === '\n') splitIndex++
    message = message.substring(splitIndex)
  }
  if (message.length > 0) {
    messageArray.push(surroundString + message + surroundString)
  }

  return messageArray
}