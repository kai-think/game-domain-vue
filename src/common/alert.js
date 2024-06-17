

/*
  alertList的元素类型: {
    show: true,
    title: "提示内容",
    type: "success"
  }

*/

var alertList = [];

var  alert = ({title = "成功", type = "success", timeout = 2000, 
  prominent = false, icon = null, shaped = false, color = null, border = null, dark = false, dismissible = false}) => {
  let alertData = {
    title: title,
    type: type,
    show: false,
    prominent, shaped, color, border, dark, icon, dismissible
  }

  alertList.push(alertData)
  setTimeout(() => {
    alertData.show = true

    setTimeout(() => {

      alertData.show = false;
      setTimeout(() => {
        alertList.shift()
      }, 300);

    }, timeout);

  }, 100);
}

var  success = (title, timeout) => {
  alert({title, type: "success", timeout})
}

var  info = (title, timeout) => {
  alert({title, type: "info", timeout})
}

var  warning = (title, timeout) => {
  alert({title, type: "warning", timeout})
}

var  error = (title, timeout) => {
  alert({title, type: "error", timeout})
}

export default {
  alertList,
  alert,
  success,
  info,
  warning,
  error
}