import client from "lib/api/client"
import Cookies from "js-cookie"

export const getChatRooms = () => {
  return client.get("chat_rooms", { headers: {
    "access-token": Cookies.get("_access_token") || "",
    "client": Cookies.get("_client") || "",
    "uid": Cookies.get("_uid") ||""
  }})
}

export const getChatRoom = (id: number) => {
  return client.get(`chat_rooms/${id}`, { headers: {
    "access-token": Cookies.get("_access_token") || "",
    "client": Cookies.get("_client") || "",
    "uid": Cookies.get("_uid") || ""
  }})
}