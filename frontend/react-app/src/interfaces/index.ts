import { StringifyOptions } from "querystring"

export interface SignUpData {
  name: string
  email: string
  password: string
  passwordConfirmation: string
  gender: number
  prefecture: number
  birthdat: Date
  image: string
}

export interface SignUpFormData extends FormData {
  append(name: keyof SignUpData, value: String | Blob, fileName?: string): any
}

export interface SignInData {
  email: string
  password: string
}

export interface User {
  id: number
  uid: string
  provider: string
  email: string
  name: string
  image: {
    url: string
  }
  profile: string
  gender: number
  birthday: String | number | Date
  prefecture: number
  allowPasswordChange: boolean
  createdAt?: Date
  updatedAt?: Date
}

export interface UpdateUserData {
  id: number | undefined | null
  name?: string
  prefecture?: number
  profile?: string
  image?: string
}

export interface UpdateUserFormData extends FormData {
  append(name: keyof UpdateUserData, value: String | Blob, fileName?: string): any
}

export interface Like {
  id?: number
  fromUserId: number | undefined | null
  toUserId: number | undefined | null
}

export interface ChatRoom {
  chatRoom: {
    id: number
  }
  otherUser: User,
  lastMessage: Message
}

export interface Message {
  chatRoomId: number
  userId: number | undefined
  content: string
  createdAt?: Date
}