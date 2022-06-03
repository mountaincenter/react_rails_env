import React, { useState, useContext, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import Cookies from "js-cookie"
import "date-fns"
import {
  Grid,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Typography,
  TextField,
  Card,
  CardContent,
  CardHeader,
  Button,
  IconButton,
  Box
} from "@mui/material"

import DatePicker from '@mui/lab/DatePicker'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import AdapterDateFns from '@mui/lab/AdapterDateFns'

import CancelIcon from '@mui/icons-material/Cancel';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';


import { AuthContext } from "App"
import AlertMessage from "components/utils/AlertMessage"
import { signUp } from "../../lib/api/auth"
import { SignUpFormData } from "interfaces/index"
import { prefectures } from "data/prefectures"
import { genders } from "data/genders"

const SignUp: React.FC = () => {
  const navigate = useNavigate()

  const { setIsSignedIn, setCurrentUser } = useContext(AuthContext)

  const [name, setName] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>("")
  const [gender, setGender] = useState<number>()
  const [prefecture, setPrefecture] = useState<number>()
  const [birthday, setBirthday] = useState<Date | null>(
    new Date("2000-01-01T00:00:00"),
  )
  const [image, setImage] = useState<string>("")
  const [preview, setPreview] = useState<string>("")
  const [alertMessageOpen, setAlertMessageOpen] = useState<boolean>(false)

  const uploadImage = useCallback((e: any) => {
    const file = e.target.files[0]
    setImage(file)
  }, [])

  const previewImage = useCallback((e: any) => {
    const file = e.target.files[0]
    setPreview(window.URL.createObjectURL(file))
  }, [])

  const createFormData = (): SignUpFormData => {
    const formData = new FormData()

    formData.append("name", name)
    formData.append("email", email)
    formData.append("password", password)
    formData.append("passwordConfirmation", passwordConfirmation)
    formData.append("gender", String(gender))
    formData.append("prefecture", String(prefecture))
    formData.append("birthday", String(birthday))
    formData.append("image", image)

    return formData
  }

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    const data = createFormData()

    try {
      const res = await signUp(data)
      console.log(res)
      if (res.status === 200) {
        Cookies.set("_access_token", res.headers["access-token"])
        Cookies.set("_client", res.headers["client"])
        Cookies.set("_uid", res.headers["uid"])

        setIsSignedIn(true)
        setCurrentUser(res.data.data)

        navigate("/home", { replace: true })

        setName("")
        setEmail("")
        setPassword("")
        setPasswordConfirmation("")
        setGender(undefined)
        setPrefecture(undefined)
        setBirthday(null)

        console.log("Signed in successfully!")
      } else {
        setAlertMessageOpen(true)
      }
    } catch (err) {
      console.log(err)
      setAlertMessageOpen(true)
    }
  }

  return (
    <>
      <form noValidate autoComplete="off">
        <Card sx={{ p: 2 , maxWidth: 400}}>
          <CardHeader sx={{ textAlign:"center" }} title="サインアップ" />
          <CardContent>
            <TextField
              variant="outlined"
              required
              fullWidth
              label="名前"
              value={name}
              margin="dense"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
            />
            <TextField
              variant="outlined"
              required
              fullWidth
              label="メールアドレス"
              value={email}
              margin="dense"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            />
            <TextField
              variant="outlined"
              required
              fullWidth
              label="パスワード"
              type="password"
              value={password}
              margin="dense"
              autoComplete="current-password"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            />
            <TextField
              variant="outlined"
              required
              fullWidth
              label="パスワード（確認用）"
              type="password"
              value={passwordConfirmation}
              margin="dense"
              autoComplete="current-password"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPasswordConfirmation(e.target.value)}
            />
            <FormControl
              variant="outlined"
              margin="dense"
              fullWidth
            >
              <InputLabel id="demo-simple-select-outlined-label">性別</InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={gender}
                onChange={(e) => setGender(e.target.value as number)}
                label="性別"
              >
                {
                  genders.map((gender: string, index: number) =>
                    <MenuItem value={index}>{gender}</MenuItem>
                  )
                }
              </Select>
            </FormControl>
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
                    <MenuItem key={index +1} value={index + 1}>{prefecture}</MenuItem>
                  )
                }
              </Select>
            </FormControl>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Grid container justifyContent="space-around">
                <DatePicker
                  fullWidth
                  inputVariant="outlined"
                  margin="dense"
                  id="date-picker-dialog"
                  label="誕生日"
                  format="MM/dd/yyyy"
                  value={birthday}
                  onChange={(date: Date | null) => {
                    setBirthday(date)
                  }}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                  renderInput={(data) => <TextField { ...data} />}
                />
              </Grid>
            </LocalizationProvider>
            <div style= {{ textAlign: "right" }}>
              <input
                style = {{ display: "none" }}
                accept="image/*"
                id="icon-button-file"
                type="file"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  uploadImage(e)
                  previewImage(e)
                }}
              />
              <label htmlFor="icon-button-file">
                <IconButton
                  color="primary"
                  aria-label="upload picture"
                  component="span"
                >
                  <PhotoCameraIcon />
                </IconButton>
              </label>
            </div>
            {
              preview ? (
                <Box sx={{ marginBottom: "1.5rem" }}>
                  <IconButton
                    color="inherit"
                    onClick={() => setPreview("")}
                  >
                    <CancelIcon />
                  </IconButton>
                  <img
                    src={preview}
                    alt="preview img"
                    style={{ width: "100%" }}
                  />
                </Box>
              ) : null
            }
            <div style={{ textAlign: "right"}} >
              <Button
                type="submit"
                variant="outlined"
                color="primary"
                disabled={!name || !email || !password || !passwordConfirmation ? true : false}
                sx={{ color: "default", t: 2, flexGrow: 1, textTransform: "none" }}
                onClick={handleSubmit}
              >
                送信
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
      <AlertMessage
        open={alertMessageOpen}
        setOpen={setAlertMessageOpen}
        severity="error"
        message="メールアドレスかパスワードが間違っています"
      />
    </>
  )
}

export default SignUp