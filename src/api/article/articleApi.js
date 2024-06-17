import axios from "axios"
import encryptedPost from "@/common/encryptedPost.js"

var url = u => "/front/game/article" + u;

var articleApi = {
  /**
   * 
   * @param {
   *    Integer current,
        Integer size,
        Integer userId,
        Integer circleId,
        String title,
        String subtitle,
        Integer type,
        Integer viewCount,
        Integer repleyCount,
        Integer hotCount,
        Integer likeCount,
        LocalDateTime createTime,
        LocalDateTime lastReplyTime,
        String cover} params 
   */
  page(params) {
    return axios.post(url("/page"), params);
  },
  /**
   * 得到当前用户的收藏的帖子
   * @param {Integer current,
    Integer size} params 
  */
  pageFollow(params) {
    return axios.post(url("/pageFollow"), params);
  },
  save(article) {
    return encryptedPost(url("/save"), article);
  },
  saveContent(content) {
    return encryptedPost(url("/save"), content);
  },
  getById(id) {
    return axios.get(url("/getById"), {params: {id}});
  },
  getContentByArticleId(articleId) {
    return axios.get(url("/getContentByArticleId"), {params: {id: articleId}});
  },
  delete(ids) {
    return encryptedPost(url("/delete"), {ids});
  },

  publish(article, content) {
    return axios.post(url("/publish"), {article, content});
  },

  writeReply(reply) {
    return axios.post(url("/writeReply"), reply);
  },

  deleteReply(replyId) {
    return axios.post(url("/deleteReply"), {replyId});
  },

  follow(articleId, collect) {
    return axios.post(url("/follow"), {articleId, collect});
  },
  giveThumbs(articleId, thumbsUp) {
    return axios.post(url("/giveThumbs"), {articleId, thumbsUp});
  },
  /**
   * 
   * @param Number replyId 
   * @param Boolean thumbsUp 
   */
  giveReplyThumbs(replyId, thumbsUp) {
    return axios.post(url("/giveReplyThumbs"), {replyId, thumbsUp});
  }
}

export default articleApi;