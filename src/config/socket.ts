import { io } from 'socket.io-client'
import { AppConfig } from '.'

export const socket = io(AppConfig.API_URL as string, {
  transports: ['websocket'],
  query: {
    token: localStorage.getItem('token')
  }
})

socket.on('error', () => {
  console.log('Error')
})

socket.on('connect', () => {
  console.log('Connected')
})
