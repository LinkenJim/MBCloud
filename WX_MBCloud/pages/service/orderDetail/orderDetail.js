var jyTool = require('../../../resource/lib/JYTool.js')
var util = require('../../../resource/utils/util.js')
Page({
  data: {
    id: ''
  },
  onLoad: function (options) {
    jyTool.tips.initJYTips(this);
    //获取页面参数
    this.setData({
      id: options.id
    });
    console.log(options.id);
    this.loadData();
  },
  onReady: function () {
    // 页面渲染完成
    var that = this;

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
  loadData: function () {
    var that = this;
    util.getBookingDetail({ id: that.data.id }, function (data) {
      console.log(data)
      that.setData({
        detail: data.detail
      })
    }, function (error) {

    });
  },
  callPhone: function () {
    wx.makePhoneCall({
      phoneNumber: '020-37887866' //仅为示例，并非真实的电话号码
    })
  }
})