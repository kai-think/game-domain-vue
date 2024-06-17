import axios from "axios"

var url = u => "/front/bbs/activity/luck-draw" + u;

var luckDrawApi = {

  getByBbsId(bbsId) {
    return axios.get(url("/getByBbsId"), {params: {bbsId}});
  },

  joinLuckDraw(activityId, luckDrawId) {
    return axios.post(url("/joinLuckDraw"), {activityId, luckDrawId});
  },

  getSituation(luckDrawId) {
    return axios.get(url("/getSituation"), {params: {luckDrawId}});
  },
}

export default luckDrawApi;