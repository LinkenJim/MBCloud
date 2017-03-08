// pages/case/activityDetail/activityDetail.js
var jyTool = require('../../../resource/lib/JYTool.js')
var util = require('../../../resource/utils/util.js')

Page({
  data: { activityList: [{ status: 0, time: "02.15-04.15", id: 0, image: "/resource/image/data/activity01_image.png", content:"点睛之“鼻” 自然挺翘\n假体隆鼻——1200元\n\n去膘好时节 炫腰正当时\n吸脂——999元\n\n拒绝千人一面 灵动个性\n双眼皮——1200元\n\n看不见的痕迹 看得见的诱惑\n假体丰胸——5.4折\n\n让肌肤一次喝饱水 赋活少女肌\n水光针——777元\n\n针管里的驻颜魔法 \n正品玻尿酸——499元\n\n十分钟，轻松打造明星V脸型\n瘦脸针——999元\n\n始终相信，年龄从来不是限制\n乔雅登——3.6折\n\n不用妆，自然靓\n半永久纹眉——1111元\n\n青春张扬，怎能有痘\n净肤祛痘——99元",title:"春季焕新肌，缔造美肌平衡，重焕焦点倾慕" }] },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    jyTool.tips.initJYTips(this);
    let id = options.id;
    let detail = this.data.activityList[id];
    this.setData({detail:detail});
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
  gotoApply: function (e) {
    var id = e.currentTarget.dataset.itemId;
    // if (typeof id == 'undefined') {
    //   jyTool.tips.showTips(this, '未知错误');
    //   return;
    // }
    wx.navigateTo({
      url: '/pages/case/applyActivity/applyActivity?id=' + id,
    })
  }
})