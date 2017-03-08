// pages/service/ask/ask.js
var jyTool = require('../../../resource/lib/JYTool.js')
var util = require('../../../resource/utils/util.js')

Page({
  isCommit: false,
  data:{index:-1,category:'',textCount:0},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    jyTool.tips.initJYTips(this);
  },
  onReady:function(){
    // 页面渲染完成

    // 获取类别列表
    var that = this;
    util.getQuestionType(function(data){
      // console.log(data);
      that.setData({
        typeList: data.list || []
      })
    },function(errorMsg) {
      jyTool.tips.showTips(this,errorMsg);
    })
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  //action
  //选择图片的回调
  chooesImage:function(){
    var that = this;
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        that.setData({imageArr:tempFilePaths})
      }
    })
  },
  //显示图片的方法
  previewImage:function(e){
    console.log(e);
    var current = e.currentTarget.dataset.src;
    var urls = this.data.imageArr;
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },
  //滚轮的回调
  picker:function(e){
    // console.log('picker发送选择改变，携带值为', e.detail.value);
    var temp = this.data.typeList[e.detail.value];
    this.setData({category:temp,index:e.detail.value});
  },
  // 输入文本空间的输入事件
  textInput:function(e){
    var count = e.detail.value.length;
    this.setData({textCount:count,text:e.detail.value});
  },
  //提交按钮
  formSubmit: function(e) {

    if (this.isCommit) {
      return;
    }
    
    var that = this;
    that.isCommit = true;
    util.uploadImage(this.data.imageArr,function(images){
      var tags_id = (typeof that.data.typeList[that.data.index] != 'undefined' && that.data.typeList[that.data.index].id) || null;
      util.commitQuestion({problem:that.data.text,tags_id: tags_id, images: images,formId: e.detail.formId},function(){
        that.isCommit = false;
        jyTool.tips.showTips(that,'成功',function(){
          wx.navigateBack();
        });
      },function(errorMsg){
        that.isCommit = false;
        jyTool.tips.showTips(that,errorMsg);
      })

    },function(error){
      that.isCommit = false;
      jyTool.tips.showTips(that,'请求出错');
    });
  },
  onShareAppMessage: function () {
    return {
      title: '中国医美行业掌上云技术服务平台',
      path: 'pages/service/ask/ask'
    }
  }
})