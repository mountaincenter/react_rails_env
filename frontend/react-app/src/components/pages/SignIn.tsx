import React, { useState, useContext } from "react"
import { useNavigate, Link } from "react-router-dom"
import Cookies from "js-cookie"
import {
  styled,
  Typography,
  TextField,
  Card,
  CardContent,
  CardHeader,
  Button,
  Box
} from "@mui/material"


import { AuthContext } from "App"
import AlertMessage from "components/utils/AlertMessage"
import { signIn } from "../../lib/api/auth"
import { SignInData } from "interfaces"

const StyledLink = styled(Link)({
  textDecoration: "none"
})

const SignIn: React.FC = () => {
  const navigate = useNavigate()
  const { setIsSignedIn, setCurrentUser } = useContext(AuthContext)

  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [alertMessageOpen, setAlertMessageOpen] = useState<boolean>(false)

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    const params: SignInData = {
      email: email,
      password: password
    }

    try {
      const res = await signIn(params)
      console.log(res)
      if (res.status === 200) {
        Cookies.set("_access_token", res.headers["access-token"])
        Cookies.set("_client", res.headers["client"])
        Cookies.set("_uid", res.headers["uid"])

        setIsSignedIn(true)
        setCurrentUser(res.data.data)

        navigate("/home", { replace: true })

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
        <Card sx={{ p: 2, maxWidth: 400}}>
          <CardHeader sx={{textAlign: "center"}} title="Sign In" />
          <CardContent>
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
              placeholder="At least 6 characters"
              value={password}
              margin="dense"
              autoComplete="current-password"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={!email || !password ? true : false}
              sx={{ t: 2, flexGrow: 1, textTransform: "none" }}
              onClick={handleSubmit}
            >
              送信
            </Button>
            <Box textAlign="center" sx={{ marginTop: "2rem" }}>
              <Typography variant="body2">
                まだアカウントをお持ちでない方は &nbsp;
                <StyledLink to="/signup" >
                  こちら
                </StyledLink>
                から作成してください。
              </Typography>
            </Box>
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

export default SignIn