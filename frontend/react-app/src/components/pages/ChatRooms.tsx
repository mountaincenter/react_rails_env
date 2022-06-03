import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
  Grid,
  Avatar,
  Typography,
  List,
  ListItem,
  Divider,
  ListItemText,
  ListItemAvatar
} from "@mui/material"

import { getChatRooms } from "lib/api/chat_rooms"
import { ChatRoom } from "interfaces/index"

const ChatRooms: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([])

  const handleGetChatRooms = async () => {
    try {
      const res = await getChatRooms()
      if (res.status === 200) {
        setChatRooms(res.data.chatRooms)
      } else {
        console.log("No chat rooms")
      }
    } catch (err) {
      console.log(err)
    }

    setLoading(false)
  }

  useEffect(() => {
    handleGetChatRooms()
  }, [])

  return (
    <>
      {
        !loading ? (
          chatRooms.length > 0 ? (
            chatRooms.map((chatRoom: ChatRoom, index: number) => {
              return (
                <Grid container justifyContent="center">
                  <Link
                    to={`/chatroom/${chatRoom.chatRoom.id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <div style={{ flexGrow: 1, minWidth: 340, maxWidth: "100%" }}>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar
                            alt="avatar"
                            src={chatRoom.otherUser.image.url}
                          />
                        </ListItemAvatar>
                        <ListItemText
                          primary={chatRoom.otherUser.name}
                          secondary= {
                            <div style={{ marginTop: "0.5rem" }}>
                              <Typography
                                component="span"
                                variant="body2"
                                sx={{color:"text.secondary"}}
                              >
                                {chatRoom.lastMessage === null ? "まだメッセージはありません。" : chatRoom.lastMessage.content.length > 30 ? chatRoom.lastMessage.content.substr(0, 30) + "..." : chatRoom.lastMessage.content}
                              </Typography>
                            </div>
                          }
                        >
                        </ListItemText>
                      </ListItem>
                    </div>
                  </Link>
                </Grid>
              )
            })
          ) : (
            <Typography
              component= "p"
              variant="body2"
              sx={{ color: "test.secondary" }}
            >
              マッチング中の相手はいません
            </Typography>
          )
        ) : (
          <></>
        )
      }
    </>
  )
}

export default ChatRooms