import React, { useState, useEffect, useCallback, useContext } from "react"
import { useNavigate } from "react-router-dom"
import Cookies from "js-cookie"

import {
  createTheme,
  Grid,
  Typography,
  Card,
  CardContent,
  IconButton,
  Dialog,
  TextField,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Avatar,
  Divider,
  Box,
  Button
} from "@mui/material"

import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'
import CancelIcon from '@mui/icons-material/Cancel'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import SettingsIcon from '@mui/icons-material/Settings'

import { AuthContext } from "App"
import { prefectures } from "data/prefectures"

import { signOut } from "lib/api/auth"
import { getUser, updateUser } from "lib/api/users"
import { UpdateUserFormData } from "interfaces/index"

const theme = createTheme()

const Home: React.FC = () => {
  const { isSignedIn, setIsSignedIn, currentUser, setCurrentUser } = useContext(AuthContext)

  const navigate = useNavigate()

  const [editFormOpen, setEditFormOpen] = useState<boolean>(false)
  const [name, setName] = useState<string | undefined>(currentUser?.name)
  const [prefecture, setPrefecture] = useState<number | undefined>(currentUser?.prefecture || 0)
  const [profile, setProfile] = useState<string | undefined>(currentUser?.profile)
  const [image, setImage] = useState<string>("")
  const [preview, setPreview] = useState<string>("")

  const uploadImage = useCallback((e: any) => {
    const file = e.target.files[0]
    setImage(file)
  }, [])

  const previewImage = useCallback((e: any) => {
    const file = e.target.files[0]
    setPreview(window.URL.createObjectURL(file))
  }, [])

  const currentUserAge = (): number | void => {
    const birthday = currentUser?.birthday.toString().replace(/-/g, "") || ""
    if (birthday.length !== 8) return

    const date = new Date()
    const today = date.getFullYear() + ("0" + (date.getMonth() + 1)).slice(-2) + ("0" + date.getDate()).slice(-2)
    return Math.floor((parseInt(today) - parseInt(birthday)) / 10000)
  }

  const currentUserPrefecture = (): string => {
    return prefectures[(currentUser?.prefecture || 0) - 1]
  }

  const createFormData = (): UpdateUserFormData => {
    const formData = new FormData()

    formData.append("name", name || "")
    formData.append("prefecture", String(prefecture))
    formData.append("profile", profile || "")
    formData.append("image", image)

    return formData
  }

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    const data = createFormData()

    try {
      const res = await updateUser(currentUser?.id, data)
      console.log(res)

      if (res.status === 200) {
        setEditFormOpen(false)
        setCurrentUser(res.data.user)

        console.log("Update user successfully!")
      } else {
        console.log(res.data.message)
      }
    } catch (err) {
      console.log(err)
      console.log("Failed in updating user!")
    }
  }

  const handleSignOut = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      const res = await signOut()

      if (res.data.success === true) {
        Cookies.remove("_access_token")
        Cookies.remove("_client")
        Cookies.remove("_uid")

        setIsSignedIn(false)
        navigate("/signin")

        console.log("Succeeded in sign out")
      } else {
        console.log("Failed in sign out")
      }
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <>
      {
        isSignedIn && currentUser ? (
          <>
            <Card sx={{ width: 340}}>
              <CardContent>
                <Grid container justifyContent="flex-end">
                  <Grid item>
                    <IconButton
                      onClick={() => setEditFormOpen(true)}
                    >
                      <SettingsIcon
                        color="action"
                        fontSize="small"
                      />
                    </IconButton>
                  </Grid>
                </Grid>
                <Grid container justifyContent="center">
                  <Grid item>
                    <Avatar
                      alt="avatar"
                      src={currentUser?.image.url}
                      sx={{ width: theme.spacing(10), height: theme.spacing(10) }}
                    />
                  </Grid>
                </Grid>
                <Grid container justifyContent="center">
                  <Grid item style={{ marginTop: "1.5rem"}}>
                    <Typography variant="body1" component="p" gutterBottom>
                      {currentUser?.name} {currentUserAge()}歳 ({currentUserPrefecture()})
                    </Typography>
                    <Divider style={{ marginTop: "0.5rem"}}/>
                    <Typography
                      variant="body2"
                      component="p"
                      gutterBottom
                      style={{ marginTop: "0.5rem", fontWeight: "bold"}}
                    >
                      自己紹介
                    </Typography>
                    {
                      currentUser.profile ? (
                        <Typography variant="body2" component="p" sx={{color: "text.secondary"}}>
                          {currentUser.profile}
                        </Typography>
                      ) : (
                        <Typography variant="body2" component="p" sx={{color: "text.secondary"}}>
                          よろしくお願いいたします。
                        </Typography>
                      )
                    }
                    <Button
                      variant="outlined"
                      onClick={handleSignOut}
                      color="primary"
                      fullWidth
                      startIcon={<ExitToAppIcon />}
                      style={{ marginTop: "1rem"}}
                    >
                      サインアウト
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
            <form noValidate autoComplete="off">
              <Dialog
                open={editFormOpen}
                keepMounted
                onClose={() => setEditFormOpen(false)}
              >
                <DialogTitle style={{ textAlign: "center"}}>
                  プロフィールの変更
                </DialogTitle>
                <DialogContent>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    label="名前"
                    value={name}
                    margin="dense"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                  />
                  <FormControl
                    variant="outlined"
                    margin="dense"
                    fullWidth
                  >
                    <InputLabel id="demo-simple-select-outlined-label">都道府県</InputLabel>
                    <Select
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
                      value={prefecture}
                      onChange={(e) => setPrefecture(e.target.value as number)}
                      label="都道府県"
                    >
                      {
                        prefectures.map((prefecture, index) =>
                          <MenuItem key={index + 1} value={index + 1}>{prefecture}</MenuItem>
                        )
                      }
                    </Select>
                  </FormControl>
                  <TextField
                    placeholder="1000文字以内で書いてください。"
                    variant="outlined"
                    multiline
                    fullWidth
                    label="自己紹介"
                    rows="8"
                    value={profile}
                    margin="dense"
                    onChange={(e) => {
                      setProfile(e.target.value)
                    }}
                  />
                  <div style={{ textAlign: "right" }}>
                    <input
                      accept="image/*"
                      id="icon-button-file"
                      type="file"
                      style={{ display: "none"}}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        uploadImage(e)
                        previewImage(e)
                      }}
                    />
                    <label htmlFor="icon-button-file">
                      <IconButton
                        sx={{ color:"primary.main" }}
                        aria-label="upload picture"
                        component="span"
                      >
                        <PhotoCameraIcon />
                      </IconButton>
                    </label>
                  </div>
                  {
                    preview ? (
                      <Box
                        sx={{marginBottom: "1.5rem"}}
                      >
                        <IconButton
                          color="inherit"
                          onClick={() => setPreview("")}
                        >
                          <CancelIcon />
                        </IconButton>
                        <img
                          src={preview}
                          alt="preview img"
                          style={{ textAlign: "right"}}
                        />
                      </Box>
                    ) : null
                  }
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={handleSubmit}
                    color="primary"
                    disabled={!name || !profile ? true : false}
                  >
                    送信
                  </Button>
                </DialogActions>
              </Dialog>
            </form>
          </>
        ) : (
          <></>
        )
      }
    </>
  )
}

export default Home