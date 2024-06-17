

var data = {
  dialog: false,
  title: "标题",
  content: "内容",
  confirmCallback: () => {},
  cancelCallback: () => {},
};

var  show = (title = "标题", content = "内容", confirmCallback = () => {}, cancelCallback = () => {}) => {
  data.title = title
  data.content = content
  data.confirmCallback = confirmCallback
  data.cancelCallback = cancelCallback
  data.dialog = true;
}

export default {
  data,
  show
}