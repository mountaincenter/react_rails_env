import client from "./client"

export const execTest = () => {
  return client.get("/test")
}