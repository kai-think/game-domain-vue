import store from '@/store'
import alertObj from "@/common/alert.js"
import confirmDialog from "@/common/confirmDialog.js"
import userApi from "@/api/user/userApi.js"
export default {
  data() {
    return {
      alert: {
        success: (title, timeout) => {
          alertObj.success(title, timeout)
        },
        info: (title, timeout) => {
          alertObj.info(title, timeout)
        },
        warning: (title, timeout) => {
          alertObj.warning(title, timeout)
        },
        error: (title, timeout) => {
          alertObj.error(title, timeout)
        },
        show: (params) => {
          alertObj.alert(params)
        }
      },
    }
  },
  methods: {
    formatDate,
    formatSrc,
    formatThumbnailSrc,
    showConfirmDialog: confirmDialog.show,
    formatDic,
    getDic,
    isManufacturer
  },
  computed: {
    
  }
}

async function isManufacturer({circleId, userId}) {
  if (userId == null || circleId == null)
    return false
  //加载该圈子的厂商用户，这时会缓存到store里面
  await userApi.listManufacturer(circleId)
  //通过user得到对应厂商详情
  let manufacturer = store.state.manufacturerMap[userId]

  if (manufacturer == null) 
    return false;

  return manufacturer.circleId == circleId
}

function formatDate(date) {
  if (date == null) 
    return "未知";

  if (!Array.isArray(date))
    return "只接受数组日期";
    
  let str;
  date[3] = format02d(date[3])
  date[4] = format02d(date[4])
  if (date.length > 5)
    str = `${date[0]}-${date[1]}-${date[2]} ${date[3]}:${date[4]}:${date[5]}`
  else
    str = `${date[0]}-${date[1]}-${date[2]} ${date[3]}:${date[4]}:00`
  let time = new Date(str).getTime();
  let nowTime = new Date().getTime();

  let diffSecond = Math.floor((nowTime - time) / 1000)

  let offset, unit
  if (diffSecond < 10)  //小于10秒
  {
    return {
      dateFormat: str,
      diffFormat: "刚刚"
    }
  }

  if (diffSecond < 60)  //分钟
  {
    unit = "秒"
    offset = diffSecond;
  }
  else if (diffSecond < 3600) //小时
  {
    unit = "分钟"
    offset = Math.floor(diffSecond / 60);
  }
  else if (diffSecond < 86400) //天
  {
    unit = "小时"
    offset = Math.floor(diffSecond / 3600);
  }
  else if (diffSecond < 86400 * 7) //周
  {
    unit = "天"
    offset = Math.floor(diffSecond / 86400);
  }
  else if (diffSecond < 86400 * 7 * 4) //月
  {
    unit = "周"
    offset = Math.floor(diffSecond / (86400 * 7));
  }
  else if (diffSecond < 86400 * 365)  //年
  {
    unit = "月"
    offset = Math.floor(diffSecond / (86400 * 7 * 4));
  }
  else
  {
    unit = "年"
    offset = Math.floor(diffSecond / (86400 * 365));
  }

  return {
    date: `${date[0]}-${date[1]}-${date[2]}`,
    dateFormat: str,
    diffFormat: `${offset}${unit}前`
  }
}

function format02d(num) {
  if (typeof num === "string") 
    num = Number.parseInt(num)
  return num < 10 ? "0" + num : num
}

import vueConfig from '@/../vue.config'
let proxy = vueConfig.devServer.proxy;
let servletPath = Object.keys(proxy)[0];
function formatSrc(src) {
  if (typeof src === 'string')
    return servletPath + '/static' + src;

  return null;
}

function formatThumbnailSrc(src) {
  if (typeof src !== 'string')
    return null;

  let dotIdx = src.lastIndexOf(".");
  return servletPath + '/static/thumbnails' + src.substring(0, dotIdx) + "-thumbnail" + src.substring(dotIdx);
}

import dicApi from "@/api/common/dicApi"

async function formatDic(value, dicNameOrId) {
  if (value == null || dicNameOrId == null)
    return "未知1";
  
  let dicMap = store.state.dicMap;
  let dic = dicMap[dicNameOrId];

  if (dic == null)
    if (typeof dicNameOrId === "string")
    {
      dic = await dicApi.getByName(dicNameOrId)
      store.dispatch("pushDic", dic);
    }

  if (dic != null && Array.isArray(dic.children)) {
    for (let child of dic.children) {
      if (child.value == value)
        return child.name
    }

    return "未知2"
  }

  
  return "未知"
}


async function getDic(dicNameOrId) {
  if (dicNameOrId == null)
    return {children: []};
  
  let dicMap = store.state.dicMap;
  let dic = dicMap[dicNameOrId];

  if (dic == null)
    if (typeof dicNameOrId === "string")
    {
      dic = await dicApi.getByName(dicNameOrId)
      store.dispatch("pushDic", dic);
    }

  if (dic != null)
    return dic;
    
  return {children: []}
}