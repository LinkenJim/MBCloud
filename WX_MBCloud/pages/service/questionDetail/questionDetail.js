// pages/service/questionDetail/questionDetail.js
var jyTool = require('../../../resource/lib/JYTool.js')
var util = require('../../../resource/utils/util.js')

Page({
  isCommit: false,
  data:{placeholder: '', clickType:0, value:''},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    jyTool.tips.initJYTips(this);

    //获取页面参数
    this.setData({isAnswer:options.isAnswer,id:options.id});
    //适配屏幕大小
    var img_width = (wx.getSystemInfoSync().windowWidth - 106)/3;
    this.setData({img_width:img_width});
  },
  onReady:function(){
    // 页面渲染完成

    var that = this;
    util.getQuestionDetail({id:this.data.id},function(res){
      that.setData({detail:res.detail,list:res.comments});
      that.setData({post_id: res.detail.id, to_openid: res.detail.openid, parentid: '0',clickType: 0,placeholder: ''});
    },function(errorMsg){
      jyTool.tips.showtips(that,errorMsg);
    });
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
  previewImage:function(e){
    var current = e.currentTarget.dataset.src;
    var urls = [];
    for (var i in this.data.detail.images.photo){
      urls.push(this.data.detail.images.photo[i].url);
    }
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },
  onPullDownRefresh: function(){
    var that = this;
    util.getQuestionDetail({id:this.data.id},function(res){
      wx.stopPullDownRefresh();
      that.setData({detail:res.detail,list:res.list});
    },function(errorMsg){
      wx.stopPullDownRefresh();
      jyTool.tips.showtips(that,errorMsg);
    });
  },
  onShareAppMessage: function () {
    return {
      title: '中国医美行业掌上云技术服务平台',
      path: 'pages/service/questionDetail/questionDetail?id=' + this.data.id
    }
  },
  //点击评论事件
  clickComment: function(e) {
    let reply_name = this.data.list[e.currentTarget.dataset.i].name
    this.setData({placeholder: reply_name});


    let post_id = this.data.detail.id;
    let to_openid = this.data.list[e.currentTarget.dataset.i].openid;
    let parentid = this.data.list[e.currentTarget.dataset.i].id;

    console.log(post_id, to_openid, parentid);   

    this.setData({post_id: post_id, to_openid: to_openid, parentid: parentid,clickType: 1})

  },
  //点击回复事件
  clickReply: function(e) {
    // let parent_id = e.currentTarget.dataset.id;
    // let open_id= e.currentTarget.dataset.openId;
    // let post_id = this.data.detail.id;

    // let reply_name = e.currten

    // this.setData({placeholder: '回复:' +''});

    let reply_name = this.data.list[e.currentTarget.dataset.i].two_children[e.currentTarget.dataset.j].name
    this.setData({placeholder: reply_name});


    let post_id = this.data.detail.id;
    let to_openid = this.data.list[e.currentTarget.dataset.i].two_children[e.currentTarget.dataset.j].openid;
    let parentid = this.data.list[e.currentTarget.dataset.i].two_children[e.currentTarget.dataset.j].id;

    console.log(post_id, to_openid, parentid);   

    this.setData({post_id: post_id, to_openid: to_openid, parentid: parentid,clickType: 2})

    console.log(e.currentTarget.dataset.i,e.currentTarget.dataset.j);

  },
  clickQuestion: function() {

    this.setData({placeholder:''});
    // util.comment({content: '内容', post_id: '问题id', parentid: '评论id', to_openid: '被回复者id'});
    let post_id = that.data.detail.id;
    let to_openid = that.data.detail.openid;
    this.setData({post_id: post_id, to_openid: to_openid, parentid: '0',clickType: 0});

  },
  // 输入文本空间的输入事件
  textInput:function(e){
    var count = e.detail.value.length;
    this.setData({text:e.detail.value});
  },
  comment: function(e){
    let that = this;
    
    if (that.isCommit) {
      return;
    }

    let content = that.data.text;
    if (typeof content == 'undefined' || content.length <= 0) {
      jyTool.tips.showTips(that,'回复内容不能为空');
      return;
    }

    switch(that.data.clickType){
      case 0:
          {
          let post_id = that.data.post_id;
          let to_openid = that.data.to_openid;
          let parentid = that.data.parentid;
          that.isCommit = true;
          util.comment({content: content, post_id: post_id, parentid: parentid, to_openid: to_openid},function(){
            that.isCommit = false;
            jyTool.tips.showTips(that,'评论成功', function(){
              that.setData({value:''});
              util.getQuestionDetail({id:that.data.id},function(res){
                console.log(res);
                that.setData({detail:res.detail,list:res.comments});
                that.setData({post_id: res.detail.id, to_openid: res.detail.openid, parentid: '0',clickType: 0,placeholder: ''});
              },function(errorMsg){
                jyTool.tips.showtips(that,errorMsg);
              });
            });

          }, function(errorMsg) {
            that.isCommit = false;
            jyTool.tips.showTips(that,errorMsg);
          });}
        break;
      case 1:
          {let post_id = that.data.post_id;
          let to_openid = that.data.to_openid;
          let parentid = that.data.parentid;
          that.isCommit = true;
          util.comment({content: content, post_id: post_id, parentid: parentid, to_openid: to_openid},function(){
            that.isCommit = false;
            jyTool.tips.showTips(that,'评论成功', function(){
              that.setData({value:''});
              util.getQuestionDetail({id:that.data.id},function(res){
                console.log(res);
                that.setData({detail:res.detail,list:res.comments});
                that.setData({post_id: res.detail.id, to_openid: res.detail.openid, parentid: '0',clickType: 0,placeholder: ''});
              },function(errorMsg){
                jyTool.tips.showtips(that,errorMsg);
              });
            });
          }, function(errorMsg) {
            that.isCommit = false;
            jyTool.tips.showTips(that,errorMsg);
          });}
        break;
      default:
          {let post_id = that.data.post_id;
          let to_openid = that.data.to_openid;
          let parentid = that.data.parentid;
          that.isCommit = true;
          util.comment({content: content, post_id: post_id, parentid: parentid, to_openid: to_openid},function(){
            that.isCommit = false;
            jyTool.tips.showTips(that,'评论成功', function(){
              that.setData({value:''});
              util.getQuestionDetail({id:that.data.id},function(res){
                console.log(res);
                that.setData({detail:res.detail,list:res.comments});
                that.setData({post_id: res.detail.id, to_openid: res.detail.openid, parentid: '0',clickType: 0,placeholder: ''});
              },function(errorMsg){
                jyTool.tips.showtips(that,errorMsg);
              });
            });
          }, function(errorMsg) {
            that.isCommit = false;
            jyTool.tips.showTips(that,errorMsg);
          });}
        break;
    }


  }
})