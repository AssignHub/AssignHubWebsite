import { defineStore } from 'pinia'
import io, { Socket } from 'socket.io-client'
import { socketURL } from '~~/utils'

export function initSocket() {
  const socket = useSocket()
  socket.socketObject = io(socketURL, { path: '/sockets', withCredentials: true })
  socket.socketObject.on('addAssignment', () => {
    
  })
  socket.socketObject.on('removeAssignment', () => {
    
  })
  socket.socketObject.on('addClass', () => {
    
  })
  socket.socketObject.on('removeClass', () => {
    
  })
  socket.socketObject.on('addNonLectureSection', () => {
    
  })
  socket.socketObject.on('removeNonLectureSection', () => {
    
  })
}

export const useSocket = defineStore('socket', {
  state: () => ({
    socketObject: null as Socket,
  })
})