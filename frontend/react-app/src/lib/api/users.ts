import client from "lib/api/client"
import { UpdateUserFormData } from "interfaces/index"
import Cookies from "js-cookie"

export const getUsers = () => {
  return client.get("users", { headers: {
    "access-token": Cookies.get("_access_token") || "",
    "client": Cookies.get("_client") || "",
    "uid": Cookies.get("_uid") || ""
  }})
}

export const getUser = (id: number | undefined) => {
  return client.get(`users/${id}`)
}

export const updateUser = (id: number | undefined | null, data: UpdateUserFormData) => {
  return client.put(`users/${id}`, data)
}