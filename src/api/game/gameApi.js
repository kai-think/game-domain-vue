import axios from "axios"
import encryptedPost from "@/common/encryptedPost.js"

var url = u => "/front/game" + u;

var gameApi = {
  pageGameInfo({name, classification, category, current, size}) {
    return axios.post(url("/pageGameInfo"), {name, classification, category, current, size});
  },
  getGameInfoById(id) {
    return axios.get(url("/getGameInfoById"), {params: {id}});
  },
  getGameCircleById(id) {
    return axios.get(url("/getGameCircleById"), {params: {id}});
  },

  followCircle(circleId, collect) {
    return axios.post(url("/follow"), {circleId, collect});
  },
  /**
   * 得到当前用户的收藏的帖子
   * @param {Integer current,
      Integer size,
      Integer userId} params 
  */
  pageFollowCircle(params) {
    return axios.post(url("/pageFollowCircle"), params);
  },
}

export default gameApi;