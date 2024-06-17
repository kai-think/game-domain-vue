import axios from "axios"
import encryptedPost from "@/common/encryptedPost.js"

var url = u => "/front/login" + u;

var loginApi = { 
  login({username, password}) {
    return encryptedPost(url("/login"), {username, password});
  },
  loginWithToken() {
    return axios.post(url("/loginWithToken"));
  },
  /**
   * 
   * @param {username, nickname, avatar} bbsUser 
   * @param {password, email, phone, address, homepage} userinfo 
   */
  register({bbsUser, userinfo}) {
    return encryptedPost(url("/register"), {bbsUser, userinfo});
  },
}

export default loginApi;