import axios from "axios"
import encryptedPost from "@/common/encryptedPost.js"

var url = u => "/front/bbs/resource" + u;

var bbsResourceApi = {
  listResource(bbsId) {
    return axios.get(url("/listResource"), {params: {bbsId}});
  },
  uploadImage(file, onUploadProgress) {
    return axios.post("/upload/image", file, {
      timeout: 30 * 1000, //30秒超时
      onUploadProgress,
    });
  },
  uploadVideo(file, onUploadProgress) {
    return axios.post("/upload/video", file, {
      timeout: 24 * 60 * 60 * 1000, //一天超时
      onUploadProgress,
    });
  },
}

export default bbsResourceApi;