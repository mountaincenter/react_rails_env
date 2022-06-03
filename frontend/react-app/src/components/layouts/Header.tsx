import React, { useContext } from "react"
import { useNavigate, Link } from "react-router-dom"
import Cookies from "js-cookie"
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton
} from "@mui/material"

import MenuIcon from '@mui/icons-material/Menu';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';

import { signOut } from "lib/api/auth"
import { AuthContext }  from "App"

const Header: React.FC = () => {
  const { loading, isSignedIn, setIsSignedIn } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleSignOut = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      const res = await signOut()

      if (res.data.success === true) {
        Cookies.remove("_access_token")
        Cookies.remove("_client")
        Cookies.remove("_uid")

        setIsSignedIn(false)
        navigate("/signin")
        console.log("Successed in sign out")
      } else {
        console.log("Failed in sign out")
      }
    } catch(err) {
      console.log(err)
    }
  }
  const AuthButtons = () => {
    if (!loading) {
      if (isSignedIn) {
        return (
          <>
            <IconButton
              component={Link}
              to="/users"
              edge="start"
              sx={{ r: 2 }}
              color="inherit"
            >
              <SearchIcon />
            </IconButton>
            <IconButton
              component={Link}
              to="/chat_rooms"
              edge="start"
              sx={{ r: 2 }}
              color="inherit"
            >
              <ChatBubbleIcon />
            </IconButton>
            <IconButton
              component={Link}
              to="/home"
              edge="start"
              sx={{ r: 2 }}
              color="inherit"
            >
              <PersonIcon />
            </IconButton>
          </>
        )
      } else {
        return (
          <>
            <IconButton
              component={Link}
              to="/signin"
              edge="start"
              sx={{ r: 2 }}
              color="inherit"
            >
              <ExitToAppIcon />
            </IconButton>
          </>
        )
      }
    } else {
      return <></>
    }
  }
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography
            component={Link}
            to="/users"
            variant="h6"
            sx={{ flexGrow: 1, textDecoration: "none", color: "inherit"}}
          >
            sample
          </Typography>
          <AuthButtons />
        </Toolbar>
      </AppBar>
    </>
  )
}

export default Header