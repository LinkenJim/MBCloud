// pages/service/root/root.js
var jyTool = require('../../../resource/lib/JYTool.js')
var util = require('../../../resource/utils/util.js')
Page({
  offset: 0,
  isLoading: false,
  isLoadMore: false,
  data: {
    JYlist: '',
    JYTips: ''
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.initTopBar(['问美', '社区'], 'selectItem', 40);
    jyTool.toolBar.initJYToolBar(this, ['最近问美', '最近预约'], 'selseItemAction', 80);
    jyTool.tips.initJYTips(this);
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    if (this.data.topBar.currentIndex == 0) {

      if (this.data.JYlist.currentIndex == 0) {
        this.loadQuestionData();
      } else {
        this.loadMyBookingData();
      }


    } else {
      this.loadData();
    }
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  selseItemAction: function (e) {
    let index = jyTool.toolBar.selectItem(this, e);


    if (index == 0) {
      this.loadQuestionData();
    } else {
      this.loadMyBookingData();
    }
  },
  gotoBooking: function () {
    wx.navigateTo({
      url: '/pages/service/doctorList/doctorList',
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
  gotoAsk: function (e) {
    // jyTool.tips.showTips(this,'该功能尚未开放');
    wx.navigateTo({
      url: '/pages/service/ask/ask'
    })
  },
  lookAll: function () {
    let url = '';
    if (this.data.JYlist.currentIndex == 0) {
      url = '/pages/service/questionList/questionList'
    } else {
      url = '/pages/service/bookingList/bookingList'
    }
    wx.navigateTo({
      url: url
    })
  },
  gotoQuestionDetail: function (e) {
    var id = e.currentTarget.dataset.itemId;
    if (typeof id == 'undefined') {
      jyTool.showTips(this, '未知错误');
      return;
    }
    wx.navigateTo({
      url: '/pages/service/questionDetail/questionDetail?id=' + id
    })
  },
  //预约详情入口
  gotoBookingDetail: function (e) {
    var id = e.currentTarget.dataset.itemId;
    if (typeof id == 'undefined') {
      jyTool.showTips(this, '未知错误');
      return;
    }
    wx.navigateTo({
      url: '/pages/service/orderDetail/orderDetail?id=' + id
    })
  },

  //上下拉刷新
  onPullDownRefresh: function () {
    if (this.data.topBar.currentIndex == 0) {
      this.loadQuestionData();
    } else {
      this.loadData();
    }
  },
  onReachBottom: function () {
    if (this.data.topBar.currentIndex != 0) {
      this.loadMoreData();
    }
  },

  //分享
  onShareAppMessage: function () {
    return {
      title: '中国医美行业掌上云技术服务平台',
      path: 'pages/service/root/root'
    }
  },

  //初始化顶部tabbar
  initTopBar: function (items, action, width) {
    var jyList = new Object;
    jyList.list = items;
    jyList.currentIndex = 0;
    jyList.action = action;
    jyList.width = width;

    this.setData({ topBar: jyList });
  },
  //顶部tabbar切换函数
  selectItem: function (e) {
    var index = e.target.dataset.index;
    var newJYList = this.data.topBar;
    if (newJYList.currentIndex == index) {
      return;
    }
    newJYList.currentIndex = index;
    this.setData({ topBar: newJYList });
    //切换的时候不做刷新,下拉刷新的时候再请求新数据
    // if (index == 0) {
    //   this.loadQuestionData();
    // } else {
    //   this.loadData();
    // }

    if (index == 1 && typeof this.data.cqList == 'undefined') {
      this.loadData();
    }
  },

  //获取数据
  //问美页-最近问美
  loadQuestionData: function () {
    var that = this;
    util.getMyQuestionList(function (data) {
      // console.log(data);
      wx.stopPullDownRefresh();
      that.setData({
        questionList: data.list || []
      })
    }, function (errorMsg) {
      wx.stopPullDownRefresh();
      jyTool.tips.showTips(that, errorMsg);
    })
  },
  //问美页-最近问美
  loadMyBookingData: function () {
    var that = this;
    util.getLateList(function (data) {
      // console.log(data);
      wx.stopPullDownRefresh();
      that.setData({
        bookingList: data.list || []
      })
    }, function (errorMsg) {
      wx.stopPullDownRefresh();
      jyTool.tips.showTips(that, errorMsg);
    })
  },
  //社区
  loadData: function () {
    if (this.isLoading || this.isLoadMore) {
      return;
    }
    var that = this;
    that.offset = 0;
    that.setData({ noMoreData: false })
    that.isLoading = true;
    util.getQuestionList({ offset: that.offset }, function (data) {
      wx.stopPullDownRefresh();
      that.isLoading = false;

      if (!data.list || data.list.length < 10) {
        that.offset = -1;
        that.setData({ noMoreData: true })
      } else {
        that.offset += 10;
      }
      that.setData({
        cqList: data.list || []
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
    util.getQuestionList({ offset: that.offset }, function (data) {
      that.isLoadMore = false;

      if (data.list || data.list.length < 10) {
        that.offset = -1;
        that.setData({ noMoreData: true })
      }
      that.setData({
        cqList: that.data.cqList.concat(data.list || [])
      })
    }, function (errorMsg) {
      that.isLoadMore = false;
      jyTool.tips.showTips(that, errorMsg);
    })
  },
})