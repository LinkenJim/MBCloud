// pages/case/applyActivity/applyActivity.js
var jyTool = require('../../../resource/lib/JYTool.js')
var util = require('../../../resource/utils/util.js')
Page({
  data: { sex: -1 },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数

    jyTool.tips.initJYTips(this);
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  bindPickerChange: function (e) {
    this.setData({
      sex: e.detail.value
    })
  },
  commit: function (e) {
    let par = e.detail.value;

    if (par.name == '') {
      jyTool.tips.showTips(this, '名字不能为空');
      return;
    } else if (this.data.sex == -1) {
      jyTool.tips.showTips(this, '性别不能为空');
      return;
    } else if (par.age == '') {
      jyTool.tips.showTips(this, '年龄不能为空');
      return;
    } else if (par.phone == '') {
      jyTool.tips.showTips(this, '手机号码不能为空');
      return;
    } else if (par.vcode == '') {
      jyTool.tips.showTips(this, '验证码不能为空');
      return;
    }

    jyTool.tips.showTips(this, '该活动尚未开始');
  },
  getVcode: function (e) {
    jyTool.tips.showTips(this, '该活动尚未开始');
  }
})