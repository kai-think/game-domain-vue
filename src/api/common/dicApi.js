import axios from "axios"
import encryptedPost from "@/common/encryptedPost.js"

var dicApi = {
  getById(id) {
    return encryptedPost("/sys/dic/getById", {id});
  },
  getByName(name) {
    return encryptedPost("/sys/dic/getByName", {name});
  },
}

export default dicApi;