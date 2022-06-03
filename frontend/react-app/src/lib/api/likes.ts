import client from "lib/api/client"
import { Like } from "interfaces/index"

import Cookies from "js-cookie"

export const getLikes = () => {
  return client.get("likes", { headers: {
    "access-token": Cookies.get("_access_token") || "",
    "client": Cookies.get("_client") || "",
    "uid": Cookies.get("_uid") || ""
  }})
}

export const createLike = (data: Like) => {
  return client.post("likes", data)
}