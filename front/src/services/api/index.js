import axiosBuilder from "./axios"
import bridge from '../bridge/index'
import LocalData from "../LocalData"

// place your backend URL here
export const baseUrl = `http://${LocalData.LOCAL || "192.168.88.12"}:4000`
const savedURL = {}
export const Server = {
  connected: false,
  port: 1025,
  imageUrl: (image = '') => {
    if(!!image && typeof image !== "string"){
      if(!savedURL[image.name]){
        savedURL[image.name] = URL.createObjectURL(image.data)
      }
      return savedURL[image.name]
    }
    return `${baseUrl}/upload/images/${image}`
  }
}

bridge('server:port').then(port => Server.port = port || 4000)

const Api = axiosBuilder(
  baseUrl, { timeout: 120000, } // 2 min
)

export default Api