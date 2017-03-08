var jyTool = require('../../../resource/lib/JYTool.js')
var util = require('../../../resource/utils/util.js')
var mmList = ['上午', '下午']
var genderList = ['男', '女']
var total = 60;
function count_down(that) {
  that.setData({
    getcodetime: total + 's',
    btndisable:true
  });
  if (total <= 0) {
    that.setData({
      getcodetime: '重新获取',
      btndisable:false
    })
    return;
  }
  setTimeout(function(){
    total -= 1;
    count_down(that);
  },1000);
}
Page({
  data: {
    doctor_id: '',
    order_date: '',
    order_time: '',
    time: '',
    name: '',
    gender: '',
    genderNum: '',
    age: '',
    phone: "",
    code: '',
    content: '',
    getcodetime: "",
    btndisable:''
  },
  onLoad: function (options) {
    jyTool.tips.initJYTips(this);
    var data = new Date();
    this.setData({
      order_date: util.formatDay(data),
      time: mmList[0],
      order_time: 'AM',
      gender: genderList[0],
      genderNum: '1',
      doctor_id: options.id,
      getcodetime: '获取验证码',
      btndisable:false
    })
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
  loadData: function () {

  },
  bindDateChange: function (e) {
    this.setData({
      order_date: e.detail.value
    })
  },
  chooseTime: function () {
    var that = this;
    wx.showActionSheet({
      itemList: mmList,
      success: function (res) {
        if (res.tapIndex == 0) {
          that.setData({
            order_time: 'AM',
            order_time: mmList[res.tapIndex]
          })
        } else {
          that.setData({
            order_time: 'PM',
            order_time: mmList[res.tapIndex]
          })
        }
        console.log(res.tapIndex)
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
  chooseGender: function () {
    var that = this;
    wx.showActionSheet({
      itemList: genderList,
      success: function (res) {
        that.setData({
          gender: genderList[res.tapIndex],
          genderNum: res.tapIndex + 1
        })
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
  isphone2: function (inputString) {
    var partten = /^1[3,5,8]\d{9}$/;
    var fl = false;
    if (partten.test(inputString)) {
      //alert('是手机号码');
      return true;
    }
    else {
      return false;
      //alert('不是手机号码');
    }
  },
  getCode: function () {
    console.log("发短信" + this.data.phone); 
    // util.getCode({phone:18666076091},function(data){
    //   console.log(data);
    // },function(errMsg){

    // })
    var that = this;
    if (!that.isphone2(that.data.phone)) {
      wx.showToast({
        title: '手机号码错误',
        icon: '',
        duration: 1000
      });
      return;
    }
    count_down(this);
    var key = wx.getStorageSync('session_key');
    wx.request({
      url: 'https://yimcloud.com/test/index.php/Mapi/Sms/send',
      // url: 'https://yimcloud.com/index.php/Mapi/Sms/send',
      data: { session_key: key, phone: that.data.phone },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        // success
        console.log(res)
        if (res.data.code == 200) {
          wx.showToast({
            title: '验证码已发送',
            icon: '',
            duration: 1000
          });
        }
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  //用户名
  bindNameInput: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  //年龄
  bindAgeInput: function (e) {
    this.setData({
      age: e.detail.value
    })
  },
  //手机号码
  bindPhoneInput: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  //验证码
  bindCodeInput: function (e) {
    this.setData({
      code: e.detail.value
    })
  },
  //文本
  bindContentInput: function (e) {
    this.setData({
      content: e.detail.value
    })
  },
  formSubmit: function () {
    var that = this;
    if (this.data.name == null || this.data.name.length == 0) {
      wx.showToast({
        title: '名字不能为空',
        icon: '',
        duration: 1000
      });
      return;
    }
    if (this.data.age == null || this.data.name.age == 0) {
      wx.showToast({
        title: '年龄不能为空',
        icon: '',
        duration: 1000
      });
      return;
    }
    if (this.data.phone == null || this.data.name.phone == 0) {
      wx.showToast({
        title: '手机号码不能为空',
        icon: '',
        duration: 1000
      });
      return;
    }
    if (this.data.code == null || this.data.name.code == 0) {
      wx.showToast({
        title: '手机验证码不能为空',
        icon: '',
        duration: 1000
      });
      return;
    }
    if (this.data.content == null || this.data.name.content == 0) {
      wx.showToast({
        title: '内容不能为空',
        icon: '',
        duration: 1000
      });
      return;
    }
    var key = wx.getStorageSync('session_key');
    wx.request({
      url: 'https://yimcloud.com/test/index.php/Mapi/Order/add',
      // url: 'https://yimcloud.com/index.php/Mapi/Order/add',
      data: {
        session_key: key,
        doctor_id: that.data.doctor_id,
        order_date: that.data.order_date,
        order_time: that.data.order_time,
        name: that.data.name,
        sex: that.data.genderNum,
        age: that.data.age,
        phone: that.data.phone,
        code: that.data.code,
        content: that.data.content,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        // success
        console.log(res.data);
        if (res.data.code == 200) {
          wx.showToast({
            title: '预约已提交',
            icon: '',
            duration: 1000
          });
          wx.navigateBack({
            delta: 1, // 回退前 delta(默认为1) 页面
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
        } else if (res.data.code == 201) {
          wx.showToast({
            title: res.data.msg,
            icon: '',
            duration: 1000
          });
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: '',
            duration: 1000
          });
        }


      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })

    // util.addOrder({
    //   doctor_id: that.data.doctor_id,
    //   order_date: that.data.order_date,
    //   order_time: that.data.order_time,
    //   name: that.data.name,
    //   sex: that.data.sex,
    //   age: that.data.age,
    //   phone: that.data.phone,
    //   code: that.data.code,
    //   content: that.data.content,
    // }, function (res) {
    //   console.log(res);
    // }, function (errMsg) {
    //   console.log(errMsg);
    // });
  }
})