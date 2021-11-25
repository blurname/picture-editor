import { Socket } from 'socket.io-client'
import { User } from '../hooks/useUsers'

export class CanvasScoekt {
  canvasId: number
  userId: number
  users: Map<number, User>
  socket: Socket
  constructor(userId: number, canvasId: number, socket: Socket) {
    this.userId = userId
    this.canvasId = canvasId
    this.users = new Map()
    this.socket = socket
  }
  onConnection() {
    this.newJoin()
		
  }
  exit() {
    this.socket.emit('preExit', this.canvasId, this.userId)
    this.socket.on('sureExit', (result: string) => {
      if (result === 't') this.socket.close()
    })
  }
  newJoin() {
    this.socket.on('newJoin', (userMap: any) => {
      console.log('userMap:', userMap)
    })
  }
  joinUsers(id: number, user: User) {
    this.users.set(id, user)
  }
  exitUsers(id: number) {
    this.users.delete(id)
  }
}
