import axios from "axios"
import encryptedPost from "@/common/encryptedPost.js"

var url = u => "/front/bbs" + u;

var bbsApi = {
  /**
   * 
   * @param {
   *    Integer current,
        Integer size,
        Integer userId,
        Integer circleId,
        Integer forumId,
        Integer sectionId,
        Integer topping,
        String title,
        Integer type,
        Integer viewNum,
        Integer repleyCount,
        Integer hotNum,
        Integer likeNum,
        LocalDateTime createTime,
        LocalDateTime lastReplyTime,
        Integer thumbsUpCount,
        Integer thumbsDownCount,
        Integer status,
        String deleteReason} params 
   */
  page(params) {
    return axios.post(url("/page"), params);
  },
  /**
   * 
   * @param {Integer current,
            Integer size,
            Integer userId,
            Integer bbsId,
            Integer replyId,
            String content,
            LocalDateTime replyTime,
            Integer type} params 
   */
  pageReply(params) {
    return axios.post(url("/pageReply"), params);
  },
  /**
   * 得到当前用户的收藏的帖子
   * @param {Integer current,
            Integer size,
            Integer bbsId} params 
   */
  pageFollow(params) {
    return axios.post(url("/pageFollow"), params);
  },
  pageFollowForum(params) {
    return axios.post(url("/pageFollowForum"), params);
  },
  getById(id) {
    return axios.get(url("/getById"), {params: {id}});
  },
  getContentByBbsId(bbsId) {
    return axios.get(url("/getContentByBbsId"), {params: {id: bbsId}});
  },
  getForumById(forumId) {
    return axios.get(url("/getForumById"), {params: {forumId}});
  },
  getForumByCircleId(circleId) {
    return axios.get(url("/getForumByCircleId"), {params: {circleId}});
  },
  listForumSection(forumId) {
    return axios.get(url("/listForumSection"), {params: {forumId}});
  },
  /**
   * 
   * @param {userId, circleId, title, type, sectionNo} bbs 
   * @param content: string 
   */
  publish(bbs, content, resourceList) {
    return axios.post(url("/publish"), {bbs, content, resourceList});
  },
  /**
   * 
   * @param {bbs, content, activity, luckDraw, resourceList} params 
   */
  publishActivityLuckDraw(params) {
    return axios.post(url("/publishActivityLuckDraw"), params);
  },
  updateType(bbsId, type) {
    return axios.post(url("/updateType"), {bbsId, type});
  },
  
  updateStatus(bbsId, status) {
    return axios.post(url("/updateStatus"), {bbsId, status});
  },

  delete(bbsId, deleteReason) {
    return axios.post(url("/delete"), {bbsId, deleteReason});
  },

  follow(bbsId, collect) {
    return axios.post(url("/follow"), {bbsId, collect});
  },
  followForum(forumId, collect) {
    return axios.post(url("/followForum"), {forumId, collect});
  },
  /**
   * 
   * @param {*} reply 
   */
  writeReply(reply) {
    return axios.post(url("/writeReply"), reply);
  },

  deleteReply(replyId) {
    return axios.post(url("/deleteReply"), {replyId});
  },
  /**
   * 
   * @param Number bbsId 
   * @param Boolean thumbsUp 
   */
  giveThumbs(bbsId, thumbsUp) {
    return axios.post(url("/giveThumbs"), {bbsId, thumbsUp});
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

export default bbsApi;