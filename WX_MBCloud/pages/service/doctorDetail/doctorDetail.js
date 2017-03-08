var jyTool = require('../../../resource/lib/JYTool.js')
var util = require('../../../resource/utils/util.js')
Page({
  data: {
    id: '',
    image: '',
    name: '',
    qualification: '',
    sex: '',
    title: '',
    address: '',
    brief: '',
    hospital_name: ''
  },
  onLoad: function (options) {
    jyTool.tips.initJYTips(this);
    //获取页面参数
    this.setData({
      id: options.id
    });
    console.log(id);
  },
  onReady: function () {
    // 页面渲染完成
    var that = this;
    util.getDoctorDetail({ id: that.data.id }, function (data) {
      console.log(data)
      that.setData({
        image: data.detail.image,
        name: data.detail.name,
        title: data.detail.title,
        sex: data.detail.sex,
        brief: data.detail.brief,
        address: data.detail.address,
        hospital_name: data.detail.hospital_name
      })
    }, function (error) {

    });

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

  },
  gotoCase:function(){
    // var that = this;
    // wx.navigateTo({
    //   url: '/pages/service/caseDetail/caseDetail?id='+that.data.id,
    //   success: function(res){
    //     // success
    //   },
    //   fail: function() {
    //     // fail
    //   },
    //   complete: function() {
    //     // complete
    //   }
    // })
    jyTool.tips.showTips(this,"暂无更多");
  },
  gotoOrder:function(){
    var that = this ;
    wx.navigateTo({
      url: '/pages/service/order/order?id='+that.data.id,
      success: function(res){
        // success
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  }
})