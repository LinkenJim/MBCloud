
//toolBar
function initJYToolBar(that, items, action, width) {
  var jyList = new Object;
  jyList.list = items;
  jyList.currentIndex = 0;
  jyList.action = action;
  jyList.width = width;
  that.setData({ JYlist: jyList });
}

function selectItem(that, e) {
  var index = e.target.dataset.index;
  var newJYList = that.data.JYlist;

  if (newJYList.currentIndex == index) {
    return index;
  }
  newJYList.currentIndex = index;
  // that.setData({JYlist:''});
  that.setData({ JYlist: newJYList });
  // console.log(that.data.JYlist);
  return index;
}

//tips
function initJYTips(that) {
  var jyTpis = new Object;
  jyTpis.showTips = false;
  jyTpis.message = '';
  var info = wx.getSystemInfoSync();
  that.setData({ JYTips: jyTpis, screen_width: info.windowWidth, screen_height: info.windowHeight });
}

function showNormal(content) {
  wx.showModal({
    title: '提示',
    content: content,
    showCancel: false
  })
}

function showTips(that, msg, finish) {
  that.setData({ JYTips: { showTips: !that.data.JYTips.showTips, message: msg } })
  setTimeout(function () {
    that.setData({ JYTips: { showTips: false, message: '' } });
    typeof finish == 'function' && finish();
  }, 1000);
}

module.exports = {
  toolBar: {
    initJYToolBar: initJYToolBar,
    selectItem: selectItem
  },

  tips: {
    showNormal: showNormal,
    showTips: showTips,
    initJYTips: initJYTips
  }

}