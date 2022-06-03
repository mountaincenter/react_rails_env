import React, { useState, useEffect, useContext } from "react"
import {
  Grid,
  Typography,
  Dialog,
  DialogContent,
  Avatar,
  Button,
  Divider,
  createTheme
} from "@mui/material"

import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'

import AlertMessage from "components/utils/AlertMessage"

import { prefectures } from "data/prefectures"
import { getUsers } from "lib/api/users"
import { getLikes, createLike } from "lib/api/likes"
import { User, Like } from "interfaces/index"

import { AuthContext } from "App"

const theme = createTheme()

const Users: React.FC = () => {
  const { currentUser } = useContext(AuthContext)

  const initialUserState: User = {
    id: 0,
    uid: "",
    provider: "",
    email: "",
    name: "",
    image: {
      url: ""
    },
    gender: 0,
    birthday: "",
    profile: "",
    prefecture: 13,
    allowPasswordChange: true
  }

  const [loading, setLoading] = useState<boolean>(true)
  const [users, setUsers] = useState<User[]>([])
  const [user, setUser] = useState<User>(initialUserState)
  const [userDetailOpen, setUserDetailOpen] = useState<boolean>(false)
  const [likedUsers, setLikedUsers] = useState<User[]>([])
  const [likes, setLikes] = useState<Like[]>([])
  const [alertMessageOpen, setAlertMessageOpen] = useState<boolean>(false)

  const userAge = (): number | void => {
    const birthday = user.birthday.toString().replace(/-/g, "")
    if(birthday.length !== 8) return

    const date = new Date()
    const today = date.getFullYear() + ("0" + (date.getMonth() + 1)).slice(-2) + ("0" + date.getDate()).slice(-2)

    return Math.floor((parseInt(today) - parseInt(birthday)) - 10000)
  }

  const userPrefecture = (): string => {
    return prefectures[(user.prefecture) - 1]
  }

  const handleCreateLike = async (user: User) => {
    const data: Like = {
      fromUserId: currentUser?.id,
      toUserId: user.id
    }

    try {
      const res = await createLike(data)
      console.log(res)

      if (res?.status === 200) {
        setLikes([res.data.like, ...likes])
        setLikedUsers([user, ...likedUsers])
        console.log(res?.data.like)
      } else {
        console.log("Failed")
      }
      if (res?.data.isMatched === true) {
        setAlertMessageOpen(true)
        setUserDetailOpen(false)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const handleGetUsers = async () => {
    try {
      const res = await getUsers()
      console.log(res)
      if (res?.status === 200) {
        setUsers(res?.data.users)
      } else {
      console.log("No users")
      }
    } catch (err) {
      console.log(err)
    }
    setLoading(false)
  }

  const handleGetLikes = async() => {
    try {
      const res = await getLikes()
      console.log(res)
      if (res?.status === 200) {
        setLikedUsers(res?.data.activeLikes)
      } else {
        console.log("No likes")
      }
    } catch(err) {
      console.log(err)
    }
  }

  useEffect(() => {
    handleGetUsers()
    handleGetLikes()
  }, [])

  const isLikedUser = (userId: number | undefined): boolean => {
    return likedUsers?.some((likedUser: User) => likedUser.id === userId)
  }
  return (
    <>
      {
        !loading ? (
          users?.length > 0 ? (
            <Grid container justifyContent="center">
              {
                users?.map((user: User, index: number) => {
                  return (
                    <div key={index} onClick={() => {
                      setUser(user)
                      setUserDetailOpen(true)
                    }}>
                      <Grid item style={{ margin: "0.5rem", cursor: "pointer" }}>
                        <Avatar
                          alt="avatar"
                          src={user?.image.url}
                          sx={{ width: theme.spacing(10), height: theme.spacing(10)}}
                        />
                        <Typography
                          variant="body2"
                          component="p"
                          gutterBottom
                          style={{ marginTop: "0.5rem", textAlign: "center" }}
                        >
                          {user.name}
                        </Typography>
                      </Grid>
                    </div>
                  )
                })
              }
            </Grid>
          ) : (
            <Typography
              component="p"
              variant="body2"
            >
              まだ1人もユーザーがいません
            </Typography>
          )
        ) : (
          <></>
        )
      }
      <Dialog
        open={userDetailOpen}
        keepMounted
        onClose={() => setUserDetailOpen(false)}
      >
        <DialogContent>
          <Grid container justifyContent="center">
            <Grid item>
              <Avatar
                alt="avatar"
                src={ user?.image.url }
                sx={{ width: theme.spacing(10), height: theme.spacing(10)}}
              />
            </Grid>
          </Grid>
          <Grid container justifyContent="center">
            <Grid item style={{ marginTop: "1rem" }}>
              <Typography variant="body1" component="p" gutterBottom style={{ textAlign:"center" }} >
                {user.name} {userAge()}歳 ({userPrefecture()})
              </Typography>
              <Divider />
              <Typography
                variant="body2"
                component="p"
                gutterBottom
                style={{ marginTop: "0.5rem",  fontWeight: "bold"}}
              >
                自己紹介
              </Typography>
              <Typography variant="body2" component="p" sx={{ color: 'text.Secondary' }} style={{ marginTop: "0.5rem"}}>
                {user.profile ? user.profile : "よろしくお願いします"}
              </Typography>
            </Grid>
          </Grid>
          <Grid container justifyContent="center">
            <Grid item justifyContent="center">
              <Button
                variant="outlined"
                onClick={() => isLikedUser(user.id) ? void(0) : handleCreateLike(user)}
                sx={{color: "secondary.main"}}
                startIcon={isLikedUser(user.id) ? <FavoriteIcon /> : <FavoriteBorderIcon/>}
                disabled={isLikedUser(user.id) ? true : false}
                style={{ marginTop: "1rem", marginBottom: "1rem"}}
              >
                {isLikedUser(user.id) ? "いいね済み" : "いいね"}
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
      <AlertMessage
        open={alertMessageOpen}
        setOpen={setAlertMessageOpen}
        severity="success"
        message="マッチングが成立しました!"
      />
    </>
  )
}
export default Users