import React, { useContext } from "react"
import { AuthContext } from "App"

const Home: React.FC = () =>{
  const { isSignedIn, currentUser } = useContext(AuthContext)
  return (
    <>
      {
        isSignedIn && currentUser? (
          <>
            <h1>Signed in successfull!</h1>
            <h1>Email: {currentUser?.email}</h1>
            <h2>Name: {currentUser?.name}</h2>
          </>
        ) : (
          <h1>Not signed in</h1>
        )
      }
    </>
  )
}

export default Home