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
        console.log("Succeeded in sign out")
      } else {
        console.log("Failed in sign out")
      }
    } catch (err) {
      console.log(err)
    }
  }
  const AuthButtons = () => {
    if(!loading) {
      if(isSignedIn) {
        return (
          <Button
            sx={{textDecoration: "none"}}
            color="inherit"
            onClick={handleSignOut}
          >
            Sign out
          </Button>
        )
      } else {
        return (
          <>
            <Button
              sx= {{ textDecoration: "none"}}
              component={Link}
              to="/signin"
              color="inherit"
            >
              Sign In
            </Button>
            <Button
              sx= {{ textDecoration: "none"}}
              component={Link}
              to="/signup"
              color="inherit"
            >
              Sign Up
            </Button>
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
          <IconButton
            sx = {{ r: 2 }}
            edge="start"
            color="inherit"
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component={Link}
            to="/"
            variant="h6"
            sx={{ flexGrow: 1, textDecoration: "none", color: "inherit"}}
          >
            Sample
          </Typography>
          <AuthButtons />
        </Toolbar>
      </AppBar>
    </>
  )
}

export default Header