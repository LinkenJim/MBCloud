var jyTool = require('../../../resource/lib/JYTool.js')
var util = require('../../../resource/utils/util.js')

Page({
  id: '',
  data: {
  },
  onLoad: function (options) {
    jyTool.tips.initJYTips(this);
    this.id = options.id;
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    this.fetchCaseDtail();
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  loadData: function () {

  },
  gotoDoctorDetail: function (e) {
    let id = e.currentTarget.dataset.id;
    if (typeof id == 'undefined') {
      jyTool.showTips(this, '未知错误');
      return;
    }

    wx.navigateTo({
      url: '/pages/service/doctorDetail/doctorDetail?id=' + id,
      success: function (res) {
        // success
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },

  //显示图片的方法
  previewImage: function (e) {
    console.log(e);
    let current = e.currentTarget.dataset.src;
    let urls = [this.data.detail.before_image, this.data.detail.after_image];
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },
  //网络请求
  fetchCaseDtail: function () {
    let that = this;
    util.getCaseDetail({ id: that.id }, function (data) {
      that.setData({detail: data.detail});
    }, function (errorMsg) {

      jyTool.tips.showTips(that,errorMsg);
    });
  }
})