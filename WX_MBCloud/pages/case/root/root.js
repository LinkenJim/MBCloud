// pages/case/root/root.js
var jyTool = require('../../../resource/lib/JYTool.js')
var util = require('../../../resource/utils/util.js')

Page({
  offset: 0,
  isLoading: false,
  isLoadMore: false,
  data: {
    currentCategory: -1,
    cnoMoreData: false,
    categoryList: [],
    caseList: [],
    activityList: [{ status: 0, time: "02.15-04.15", id: 0, image: "/resource/image/data/activity01_image.png", content: "点睛之“鼻” 自然挺翘\n假体隆鼻——1200元\n\n去膘好时节 炫腰正当时\n吸脂——999元\n\n拒绝千人一面 灵动个性\n双眼皮——1200元\n\n看不见的痕迹 看得见的诱惑\n假体丰胸——5.4折\n\n让肌肤一次喝饱水 赋活少女肌\n水光针——777元\n\n针管里的驻颜魔法 \n正品玻尿酸——499元\n\n十分钟，轻松打造明星V脸型\n瘦脸针——999元\n\n始终相信，年龄从来不是限制\n乔雅登——3.6折\n\n不用妆，自然靓\n半永久纹眉——1111元\n\n青春张扬，怎能有痘\n净肤祛痘——99元", title: "春季焕新肌，缔造美肌平衡，重焕焦点倾慕" }]
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    jyTool.toolBar.initJYToolBar(this, ['精选案例', '热门活动'], 'selseItemAction', 40);
    jyTool.tips.initJYTips(this);
    this.fetchCaseType();
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

  //显示图片的方法
  previewImage: function (e) {
    console.log(e);
    let current = e.currentTarget.dataset.src;
    let index = e.currentTarget.dataset.index;
    let urls = [this.data.caseList[index].before_image, this.data.caseList[index].after_image];
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },

  //action
  selseItemAction: function (e) {
    jyTool.toolBar.selectItem(this, e);
  },
  selectCategory: function (e) {
    let selectId = e.currentTarget.dataset.id;
    this.isLoading = false;
    this.isLoadMore = false;
    if (this.data.currentCategory == selectId) {
      return;
    } else {
      this.setData({ currentCategory: selectId });
    }
    this.loadData();

  },
  gotoActivityDetail: function (e) {
    let index = e.currentTarget.dataset.index;
    let id = this.data.activityList[index].id;
    if (typeof id == 'undefined') {
      jyTool.tips.showTips(this, '未知错误');
      return;
    }
    wx.navigateTo({
      url: '/pages/case/activityDetail/activityDetail?id=' + id,
    })
  },
  gotoCaseDetail: function (e) {
    let index = e.currentTarget.dataset.index;
    let id = this.data.caseList[index].id;
    if (typeof id == 'undefined') {
      jyTool.tips.showTips(this, '未知错误');
      return;
    }
    wx.navigateTo({
      url: '/pages/service/caseDetail/caseDetail?id=' + id,
      success: function (res) {
        // success
      }
    })
  },
  //上下拉刷新
  onPullDownRefresh: function () {

    if (this.data.JYlist.currentIndex == 0) {
      this.loadData();
    }

  },
  onReachBottom: function () {
    if (this.data.JYlist.currentIndex == 0) {
      this.loadMoreData();
    }
  },
  onShareAppMessage: function () {
    return {
      title: '中国医美行业掌上云技术服务平台',
      path: 'pages/case/root/root'
    }
  },

  //网络请求
  //    --------案列类型
  fetchCaseType: function () {

    let that = this;
    util.getCaseTypes(function (data) {
      that.setData({ categoryList: data.list, currentCategory: -1 });
      that.loadData();
    }, function (errorMsg) {
      jyTool.tips.showTips(that, errorMsg)
    })
  },
  //    --------案列列表
  loadData: function () {
    if (this.isLoading || this.isLoadMore) {
      return;
    }
    var that = this;
    that.offset = 0;
    that.setData({ cnoMoreData: false })
    that.isLoading = true;
    util.getCaseList({ type_id: that.data.currentCategory, offset: that.offset }, function (data) {
      wx.stopPullDownRefresh();
      that.isLoading = false;

      if (!data.list || data.list.length < 10) {
        that.offset = -1;
        that.setData({ cnoMoreData: true })
      } else {
        that.offset += 10;
      }
      that.setData({
        caseList: data.list || []
      })
    }, function (errorMsg) {
      wx.stopPullDownRefresh();
      that.isLoading = false;
      jyTool.tips.showTips(that, errorMsg);
    })
  },
  loadMoreData() {
    if (this.isLoading || this.isLoadMore || this.offset < 0) {
      return;
    }
    var that = this;
    that.isLoadMore = true;
    util.getCaseList({ type_id: that.data.currentCategory, offset: that.offset }, function (data) {
      that.isLoadMore = false;

      if (data.list || data.list.length < 10) {
        that.offset = -1;
        that.setData({ cnoMoreData: true })
      }
      that.setData({
        caseList: that.data.caseList.concat(data.list || [])
      })
    }, function (errorMsg) {
      that.isLoadMore = false;
      jyTool.tips.showTips(that, errorMsg);
    })
  },
})