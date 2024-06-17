import axios from "axios"
import encryptedPost from "@/common/encryptedPost.js"

var url = u => "/front/bbs/activity-preview" + u;

var activityApi = {
  /**
   * 
   * @param { Integer current,
        Integer size,
        Integer bbsId,
        Integer type,
        LocalDateTime startTime,
        LocalDateTime endTime,
        Integer joinNum,
        Integer status} params 
   */
  page(params) {
    return axios.post(url("/page"), params);
  },
}

export default activityApi;