var jyTool = require('../../../resource/lib/JYTool.js')
var util = require('../../../resource/utils/util.js')

Page({
  offset: 0,
  isLoading: false,
  isLoadMore: false,
  data: { noMoreData: false },
  status: -1,
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数 全部,1:成功预约,2:已面诊,3:取消面诊
    jyTool.toolBar.initJYToolBar(this, ['全部', '成功预约', '已面诊', '取消面诊'], 'selseItemAction', 40);
    jyTool.tips.initJYTips(this);
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    this.loadData();
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  loadData: function () {
    if (this.isLoading || this.isLoadMore) {
      return;
    }
    var that = this;
    that.offset = 0;
    that.setData({ noMoreData: false })
    that.isLoading = true;
    util.getBookingList({ offset: that.offset, is_my: "1", status: that.status }, function (data) {
      wx.stopPullDownRefresh();
      that.isLoading = false;

      if (!data.list || data.list.length < 10) {
        that.offset += 10;
        that.setData({ noMoreData: true })
      } else {
        that.offset += 10;
      }
      that.setData({
        bookingList: data.list || []
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
    util.getBookingList({ offset: that.offset, is_my: "1", status: that.status }, function (data) {
      that.isLoadMore = false;

      if (data.list || data.list.length < 10) {
        that.offset = -1;
        that.setData({ noMoreData: true })
      }
      that.setData({
        bookingList: that.data.bookingList.concat(data.list || [])
      })
    }, function (errorMsg) {
      that.isLoadMore = false;
      jyTool.tips.showTips(that, errorMsg);
    })
  },
  //action
  selseItemAction: function (e) {
    console.log(e.currentTarget.dataset.index);
    this.status = jyTool.toolBar.selectItem(this, e) - 1;
    this.loadData();
  },
  gotoQuestionDetail: function (e) {
    var id = e.currentTarget.dataset.itemId;
    if (typeof id == 'undefined') {
      jyTool.showTips(this, '未知错误');
      return;
    }
    wx.navigateTo({
      url: '/pages/service/orderDetail/orderDetail?id=' + id,
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
  onPullDownRefresh: function () {
    this.loadData();
  },
  onReachBottom: function () {
    this.loadMoreData();
  },
  onShareAppMessage: function () {
    return {
      title: '中国医美行业掌上云技术服务平台',
      path: 'pages/service/root/root'
    }
  }
})