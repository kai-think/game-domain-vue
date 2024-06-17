import axios from "axios"
import encryptedPost from "@/common/encryptedPost.js"
import store from "@/store"

var url = u => "/front/user" + u;

var userApi = {
  /**
   * 
   * @param {id, nickname, avatar} bbsUser 
   * @param {password, email, phone, address, homepage} userinfo 
   */
  update(bbsUser, userinfo) {
    return encryptedPost(url("/update"), {bbsUser, userinfo});
  },

  updatePassword(oldPassword, newPassword) {
    return encryptedPost(url("/updatePassword"), {oldPassword, newPassword});
  },

  listManufacturer(circleId) {
    let promise = new Promise((resolve, reject) => {
      if (circleId == null || circleId <= 0) {
        reject("circleId为空")
        return;
      }
      
      store.dispatch("listManufacturer", {
        circleId,
        callback: (arr) => {
          if (arr.length > 0) {
            resolve(arr)
            return;
          }
          
          axios.get(url("/listManufacturer"), {params: {circleId}})
          .then(res => {
            store.dispatch("putManufacturer", res)
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
        }
      })

    })

    return promise;
    
  },
  
  getById(userId) {
    return axios.get(url("/getById"), {params: {userId}});
  }
}

export default userApi;