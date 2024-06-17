import axios from "axios"
import encryptedPost from "@/common/encryptedPost.js"
var url = u => "/front/notification" + u;

var notifyApi = {
  /**
   * 
   * @param {
   *    Integer current,
        Integer size,
        Integer notifierId,
        String userType,
        String notifierType,
        String title,
        String content,
        Boolean send,
        Boolean read} params 
   */
  page(params) {
    return axios.post(url("/page"), params);
  },
  pageHasRead({current, size}) {
    return axios.post(url("/pageHasRead"), {current, size});
  },
  pageUnRead({current, size}) {
    return axios.post(url("/pageUnRead"), {current, size});
  },
  listUnSend() {
    return axios.post(url("/listUnSend"));
  },
  readNotification(ids) {
    return axios.post(url("/readNotification"), {ids});
  },
  setUnRead(ids) {
    return axios.post(url("/setUnRead"), {ids});
  },
  /**
   * 
   * @param {*} notificationList 
   */
  send(notificationList) {
    return axios.post(url("/send"), params);
  },
  
  sendPlus({nofitiedUserIdList, titleTemplate, contentTemplate, notificationTime, paramNameAndValueListMapperJSONString}) {
    return axios.post(url("/sendPlus"), {nofitiedUserIdList, titleTemplate, contentTemplate, notificationTime, paramNameAndValueListMapperJSONString});
  },
}

export default notifyApi;