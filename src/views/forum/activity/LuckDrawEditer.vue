<template>
<v-form ref="form" class="py-3">
  <v-card flat>
    <v-row>
      <v-col cols="2">
        <v-text-field v-model="luckDraw.prizeNum" outlined label="奖口数量" type="number" :rules="[rules.required, rules.gt0]" />
      </v-col>
      <v-col cols="10">
        <v-text-field v-model="luckDraw.winNoticeTitle" outlined label="获奖通知标题" />
      </v-col>
    </v-row>
    
    <v-row>
      <v-col cols="12" md="6">
        <v-textarea v-model="prizeListStr" height="300" outlined label="奖品列表，逗号分开各个奖品" :rules="[rules.required, rules.prizeListLenEqPrizeNum]" />
      </v-col>
      <v-col cols="12" md="6">
        <easy-list-preview :items="prizeList" />
      </v-col>
    </v-row>

     <v-row>
      <v-col cols="12">
        <div class="d-flex align-center">
          <span>变量（#0会自动填充中奖用户的昵称）</span>
          <v-spacer />
          <v-chip 
            color="success" 
            class="rounded-pill mx-1"
            v-for="(varName, idx) in Object.keys(luckDraw.winNoticeContentVariable)" 
            :key="varName"
            @click="showEditVariable(true, 'edit', varName)"
            close 
            @click:close="onVarClose(varName)">
             {{ varName }}
          </v-chip>

          <v-btn icon small dark class="red ml-3" @click="showEditVariable(true, 'add')"><v-icon>mdi-plus</v-icon></v-btn>
        </div>
        <div class="mt-3">
          <v-textarea v-model="luckDraw.winNoticeContentTemplate" outlined label="中奖通知内容模板" />
        </div>
      </v-col>
      <v-col cols="12">
        <easy-list-preview :items="contentPreviewList" />
      </v-col>
     </v-row>
    
  </v-card>

  <v-dialog v-model="editVariable.show">
    <v-card>
      <v-card-title>
        {{ `${editVariable.mode == 'add' ? '新增' : '编辑'}变量` }}
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col class="pb-0" cols="12">
            <v-text-field outlined label="变量名" v-model="editVariable.name" />
          </v-col>
          <v-col class="pt-0" cols="12">
            <v-textarea outlined label="值列表" @change="onEditVarValueChange" v-model="editVariable.listString"></v-textarea>
          </v-col>
          <v-col cols="12">
            <easy-list-preview :items="editVariable.list" />
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn color="primary" @click="onEditVarSave">添加</v-btn>
        <v-btn color="error" @click="showEditVariable(false)">取消</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</v-form>
</template>
<script>
import EasyListPreview from '../../../components/EasyListPreview.vue';
export default {
  components: {EasyListPreview},
  props: {
    
  },
  data: () => ({
    PARAM: {
      NICKNAME: "#_nickname",
      PRIZE: "#_prize",
    },
    luckDraw: {
      activityId: null,
      prizeNum: 1,
      winNoticeTitle: "恭喜获奖",
      winNoticeContentTemplate: "恭喜 #_nickname 获奖，奖品是 #_prize",
      winNoticeContentVariable: {
        "#_nickname": Array.from({length: 100}, (v,k) => "用户" + (k + 1)),  //会填充获奖用户的名字
        "#_prize": Array.from({length: 100}, (v, k) => "奖品" + (k + 1)),    //会填充用户获得的奖项
        "#1": ["10", "20", "30"],   //自定义变量
      },
      prizeList: [],  //奖品列表
    },
    //奖品列表字符串形式 逗号分开
    prizeListStr: "一台手机 #8nbv4c6df,一台手机 #5g6h47fgd64,一台手机 #df456asf4",

    rules: {
      required: num => !!num || '不能为空',
      gt0: num => num > 0 || '数字要大于0',
      prizeListLenEqPrizeNum: str => {
        let list = str.split(",")
        return list.length === this.luckDraw.prizeNum
      }
    },
    //编辑变量的地方
    editVariable: {
      show: false,
      mode: "add",  //add or edit
      //变量名
      name: "",
      //字符串形式的变量值
      listString: "",
      //变量值是一个列表
      list: [],
    }
  }),
  computed: {
    prizeList() {
      let str = this.prizeListStr;
      let list = str == null ? [] : str.split(",");
      this.luckDraw.winNoticeContentVariable["#_prize"] = list
      this.luckDraw.prizeList = list

      // this.onChange()
      return list
    },
    contentPreviewList() {
      let template = this.luckDraw.winNoticeContentTemplate;
      let variable = this.luckDraw.winNoticeContentVariable;
      let contentList = []
      
      //遍历中奖数量
      for (let i = 0; i < this.luckDraw.prizeNum; i++) {

        let content = template;
        for (let varKey in variable) {
          let variableValue = variable[varKey];
          if (variableValue.length > i)
            content = content.replaceAll(varKey, variableValue[i])
        }
        contentList.push(content)
      }

      return contentList;
    }
  },
  watch: {
    luckDraw(newVal) {
      // this.onChange()
    }
  },
  methods: {
    showEditVariable(show, mode, targetVarName) {
      this.editVariable.show = show
      this.editVariable.mode = mode;
      this.clearEditVar()
      if (mode === "edit" && targetVarName != null) {
        this.editVariable.name = targetVarName;
        let list = this.luckDraw.winNoticeContentVariable[targetVarName];

        this.editVariable.listString = this.editVariable.list = list
      }
    },
    onEditVarValueChange(val) {
      this.editVariable.list = val == null ? [] : val.split(",")
    },
    onEditVarSave() {
      let form = this.editVariable;
      this.$set(this.luckDraw.winNoticeContentVariable, form.name, form.list)
      this.editVariable.show = false
      this.clearEditVar()
    },
    clearEditVar() {
      this.editVariable.name = ""
      this.editVariable.listString = ""
      this.editVariable.list = []
    },
    onVarClose(varName) {
      this.$delete(this.luckDraw.winNoticeContentVariable, varName)
    },
    isValidate() {
      let luckDraw = JSON.parse(JSON.stringify(this.luckDraw));
      let PARAM = this.PARAM
      if (luckDraw[PARAM.NICKNAME]) {
        luckDraw[PARAM.NICKNAME] = []
      }
      if (luckDraw[PARAM.PRIZE]) {
        luckDraw[PARAM.PRIZE] = []
      }

      console.log("luckDraw changed", luckDraw)
      this.$emit("change", luckDraw);
    },
    //供外部使用，返回幸运抽奖表单
    getLuckDraw() {
      let luckDraw = JSON.parse(JSON.stringify(this.luckDraw));
      let PARAM = this.PARAM
      if (luckDraw.winNoticeContentVariable[PARAM.NICKNAME]) {
        luckDraw.winNoticeContentVariable[PARAM.NICKNAME] = []
      }
      if (luckDraw.winNoticeContentVariable[PARAM.PRIZE]) {
        luckDraw.winNoticeContentVariable[PARAM.PRIZE] = []
      }
      return luckDraw
    },
    //供外部使用，验证表单是否合法
    validate() {
      return this.$refs.form.validate()
    }
  },
  created() {
    let vm = this;
    
    this.rules = {
      required: num => !!num || '不能为空',
      gt0: num => num > 0 || '数字要大于0',
      prizeListLenEqPrizeNum: str => {
        return (vm.prizeList.length == vm.luckDraw.prizeNum) || "奖品数量要对等"
      }
    }
  }
}
</script>