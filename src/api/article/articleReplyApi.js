import axios from "axios"
import encryptedPost from "@/common/encryptedPost.js"

var url = u => "/front/game/article/reply" + u;

var articleApi = {
  /**
   * 
   * @param {
   *    Integer current,
        Integer size,
        Integer articleId,
        Integer replyId,
        Integer userId,
        String content,
        LocalDateTime replyTime,
        Integer type,
        Integer thumbsUpCount,
        Integer thumbsDownCount,
        String username,
        String nickname,
        String avatar
        Boolean descByReplyTime,
        Boolean ascByReplyTime
      } params 
   */
  page(params) {
    return axios.post(url("/page"), params);
  },
  save(article) {
    return encryptedPost(url("/save"), article);
  },
  getById(id) {
    return axios.get(url("/getById"), {params: {id}});
  },
  delete(ids) {
    return encryptedPost(url("/delete"), {ids});
  },
  
}

export default articleApi;