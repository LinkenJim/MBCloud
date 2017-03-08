var jyTool = require('../../../resource/lib/JYTool.js')
var util = require('../../../resource/utils/util.js')
var titleList = ['不限职称', '住院医师', '主治医师', '副主任医师', '主任医师']
Page({
  title: '',
  offset: 0,
  isLoading: false,
  isLoadMore: false,
  data: { noMoreData: false },
  qualification: -1,
  onLoad: function (options) {
    jyTool.tips.initJYTips(this);
    this.setData({
      title: titleList[0]
    })
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

  },
  loadData: function () {
    if (this.isLoading || this.isLoadMore) {
      return;
    }
    var that = this;
    that.offset = 0;
    that.setData({ noMoreData: false })
    that.isLoading = true;
    util.getDoctorList({ offset: that.offset, limit: '10', qualification: that.data.qualification }, function (data) {
      wx.stopPullDownRefresh();
      that.isLoading = false;
      if (!data.list || data.list.length < 10) {
        that.offset += 10;
        that.setData({ noMoreData: true })
      } else {
        that.offset += 10;
      }
      that.setData({
        doctorList: data.list || []
      })
      console.log(data);
    }, function (errMsg) {
      wx.stopPullDownRefresh();
      that.isLoading = false;
      jyTool.tips.showTips(that, errorMsg);
    });
  },
  order: function (e) {
    // pages/service/order/order
    var id = e.currentTarget.dataset.itemId;
    if (typeof id == 'undefined') {
      jyTool.showTips(this, '未知错误');
      return;
    }
    wx.navigateTo({
      url: '/pages/service/order/order?id=' + id,
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
  gotoDetail: function (e) {
    var id = e.currentTarget.dataset.itemId;
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
  goodAt: function () {
    wx.showActionSheet({
      itemList: ['隆胸', '隆鼻', '割眼角'],
      success: function (res) {
        console.log(res.tapIndex)
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
  professional: function () {
    var that = this;
    wx.showActionSheet({
      itemList: titleList,
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            that.setData({
              qualification: '-1',
              title: titleList[res.tapIndex]
            })
          } else {
            that.setData({
              qualification: res.tapIndex,
              title: titleList[res.tapIndex]
            })
          }
          wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 1000
          });
        }
        console.log(that.data.qualification)
        that.loadData();
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  }
})