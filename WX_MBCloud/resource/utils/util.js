function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatDay(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  return [year, month, day].map(formatNumber).join('-')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function log(msg) {
  console.log(msg);
}

// 检查是否存在sessionKey
function cheackSessionKeyEmpty(that) {
  that.session_key = wx.getStorageSync('session_key') || '';
  if (that.session_key == null || that.session_key.length <= 0) {
    return true;
  } else {
    return false;
  }
}

// 获取sessionKey
function getSessionKey() {
  var app = getApp();
  return (typeof app != 'undefined' && typeof app.session_key != 'undefined' && app.session_key) || '';
}

//测试环境
const HOST = 'https://yimcloud.com/test/index.php/Mapi/';
//正式环境
// const HOST =  'https://yimcloud.com/index.php/Mapi/';

// post 请求
function postRequest(url, data, success, error) {

  if (typeof url != 'string' && url.length <= 0) {
    log('url 不能为空');
    return;
  }

  wx.request({
    url: HOST + url,
    data: data,
    method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    success: function (res) {
      fillerError(res.data, success, error)
    },
    fail: function () {
      // fail
    },
    complete: function () {
      // complete
    }
  })
}

//过滤返回码
function fillerError(data, success, error) {
  if (data.code == 200) {
    typeof success == 'function' && success(data.data)
    return;
  } else if (data.code == 101) {
    // typeof error == 'function' && error(data.msg)
    gotoLogin();
  } else {

  }
  typeof error == 'function' && error(data.msg)
}

//重登录
function gotoLogin() {

  var that = getApp();
  if (typeof that == 'undefined') {
    return;
  }

  wx.login({
    success: function (res) {
      // success
      postRequest('Log/getSessionKey', { js_code: res.code },
        function (data) {
          wx.setStorageSync('session_key', data.session_key);
          that.session_key = data.session_key;
          addUserInfo(that);
        }, function (msg) {
          log(msg);
        })
    },
    fail: function () {
      // fail
    },
    complete: function () {
      // complete
    }
  })
}

//登录接口
function login(that) {
  if (typeof that == 'undefined') {
    that = getApp();
    if (typeof that == 'undefined') {
      return;
    }
  }
  if (cheackSessionKeyEmpty(that)) {
    wx.login({
      success: function (res) {
        // success
        postRequest('Log/getSessionKey', { js_code: res.code },
          function (data) {
            wx.setStorageSync('session_key', data.session_key);
            that.session_key = data.session_key;
            addUserInfo(that);
          }, function (msg) {
            log(msg);
          })
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  }
}

//更新用户信息
function addUserInfo(that) {
  if (typeof that == 'undefined') {
    that = getApp();
    if (typeof that == 'undefined') {
      return;
    }
  }
  wx.getUserInfo({
    success: function (res) {
      // success
      postRequest('Oauthuser/addUserInfo',
        {
          nickName: res.userInfo.nickName,
          avatarUrl: res.userInfo.avatarUrl,
          session_key: that.session_key
        }, function (res) {
          log(res);
        }, function (res) {
          log(res);
        });
    },
    fail: function () {
      // fail
    },
    complete: function () {
      // complete
    }
  })
}

//获取最近问美列表
function getMyQuestionList(success, error) {
  var sessionKey = getSessionKey();
  postRequest('Onlinebeauty/getLateList', { session_key: sessionKey }, success, error);
}

//获取问美列表
function getQuestionList(params, success, error) {
  var sessionKey = getSessionKey();
  if (typeof params == 'undefined') {
    log('getQuestionList 缺少参数');
    return;
  } else if (typeof params.offset == 'undefined') {
    log('getQuestionList 缺少参数');
    return;
  }
  var status = -1;
  if (typeof params.status != 'undefined') {
    status = params.status;
  }

  postRequest('Onlinebeauty/getList', { session_key: sessionKey, offset: params.offset, is_my: params.is_my, status: status }, success, error)
}

//获取问美详情
function getQuestionDetail(params, success, error) {
  var sessionKey = getSessionKey();
  if (typeof params == 'undefined') {
    log('getQuestionList 缺少参数');
    return;
  } else if (typeof params.id == 'undefined') {
    log('getQuestionList 缺少参数');
    return;
  }
  postRequest('Onlinebeauty/getDetail', { session_key: sessionKey, id: params.id }, success, error)
}

//获取问美分类
function getQuestionType(success, error) {
  var sessionKey = getSessionKey();
  postRequest('Onlinebeauty/getTag', { session_key: sessionKey }, success, error)
}

//提交问美接口
function commitQuestion(params, success, error) {
  var sessionKey = getSessionKey();
  if (typeof params == 'undefined') {
    log('getQuestionList 缺少参数');
    return;
  } else if (typeof params.problem == 'undefined' || params.problem.length <= 0) {
    typeof error == 'function' && error('问题不能为空');
    log('getQuestionList 缺少参数');
    return;
  } else if (typeof params.tags_id == 'undefined' || params.tags_id == null) {
    typeof error == 'function' && error('请选择问题类型');
    log('getQuestionList 缺少参数');
    return;
  }
  postRequest('Onlinebeauty/add', { session_key: sessionKey, problem: params.problem, tags_id: params.tags_id, images: params.images, form_id: params.formId }, success, error)
}

//上传图片
function uploadImage(imageArr, success, error, objImages) {

  if (typeof imageArr == 'undefined' || imageArr.length <= 0) {
    typeof success == 'function' && success(objImages);
    return;
  }

  // let url = 'https://yimcloud.com/index.php/Mapi/Common/plupload';
  let url = 'https://yimcloud.com/test/index.php/Mapi/Common/plupload';

  var sessionKey = getSessionKey();
  var imagePath = imageArr.shift();
  wx.uploadFile({
    url: url, //仅为示例，非真实的接口地址
    filePath: imagePath,
    header: {
      'content-type': 'multipart/form-data'
    },
    name: 'file',
    formData: {
      'session_key': sessionKey
    },
    success: function (res) {
      var data = JSON.parse(res.data);
      fillerError(data, function (res) {
        objImages = objImages || [];
        objImages.push(res);
        uploadImage(imageArr, success, error, objImages);
      }, error);
    },
    fail: function (res) {
      typeof error == 'function' && error('请求出错');
      console.log(res);
    }
  })
}

//评论问题 content 内容 post_id 问题id parentid 评论id to_openid 被回复者id
function comment(params, success, error) {

  let sessionKey = getSessionKey();
  if (typeof params == 'undefined') {
    log('comment 缺少参数');
    typeof error == 'function' && error('请求出错');
    return;
  } else if (typeof params.to_openid == 'undefined') {
    typeof error == 'function' && error('请选择回复用户');
    log('comment 缺少参数');
    return;
  } else if (typeof params.content == 'undefined') {
    typeof error == 'function' && error('回复内容不能为空');
    log('comment 缺少参数');
    return;
  } else if (typeof params.post_id == 'undefined') {
    typeof error == 'function' && error('请求出错');
    log('comment 缺少参数');
    return;
  } else if (typeof params.parentid == 'undefined') {
    typeof error == 'function' && error('请选择回复用户');
    log('comment 缺少参数');
    return;
  }
  postRequest('Comment/add', { session_key: sessionKey, content: params.content, post_id: params.post_id, parentid: params.parentid, to_openid: params.to_openid, post_type: '1' }, success, error)
}

//医生列表
function getDoctorList(params, success, error) {
  var sessionKey = getSessionKey();
  if (typeof params == "undefined") {
    log('getDoctorList 缺少参数');
    return;
  } else if (typeof params.offset == "undefined") {
    log('getDoctorList 缺少参数');
    return;
  }
  postRequest('Doctor/doctorList', { session_key: sessionKey, offset: params.offset, limit: params.limit, qualification: params.qualification }, success, error)
}

//获取验证码
function getCode(params, success, error) {
  var sessionKey = getSessionKey();
  if (typeof params == "undefined") {
    log("getCode 缺少参数");
    return;
  }
  postRequest('Sms/send', { session_key: sessionKey, phone: params.phone }, success, error)
}
//获取医生详情
function getDoctorDetail(params, success, error) {
  var sessionKey = getSessionKey();
  if (typeof params == "undefined") {
    log("getDoctorDetail 缺少参数");
    return;
  }
  postRequest('Doctor/detail', { session_key: sessionKey, id: params.id }, success, error);
}
//提交预约
function addOrder(params, success, error) {
  var sessionKey = getSessionKey();
  if (typeof params == "undefined") {
    log("addOrder 缺少参数");
    return;
  }
  postRequest('Order/add', {
    session_key: sessionKey,
    doctor_id: params.doctor_id,
    order_date: params.order_date,
    order_time: params.order_time,
    name: params.name,
    sex: params.sex,
    age: params.age,
    phone: params.phone,
    code: params.code,
    content: params.content
  }, success, error)
}
//最近预约Order/getLateList
function getLateList(success, error) {
  var sessionKey = getSessionKey();
  postRequest('Order/getLateList', { session_key: sessionKey }, success, error)
}

//预约列表
function getBookingList(params, success, error) {
  var sessionKey = getSessionKey();
  if (typeof params == 'undefined') {
    log('getBookingList 缺少参数');
    return;
  } else if (typeof params.offset == 'undefined') {
    log('getBookingList 缺少参数');
    return;
  }
  var status = -1;
  if (typeof params.status != 'undefined' && params.status != -1) {
    status = params.status + 1;
  }
  postRequest('Order/getList', { session_key: sessionKey, offset: params.offset, status: status }, success, error)
}

//预约详情
function getBookingDetail(params, success, error) {
  var sessionKey = getSessionKey();
  if (typeof params == 'undefined') {
    log('getBookingDetail 缺少参数');
    return;
  }
  postRequest('Order/detail', { session_key: sessionKey, id: params.id }, success, error)
}

//案例类型列表
function getCaseTypes(success, error) {
  var sessionKey = getSessionKey();
  postRequest('Case/getTypes', { session_key: sessionKey}, success, error)
}

//案例列表
function getCaseList(params, success, error) {
  var sessionKey = getSessionKey();
  if (typeof params == 'undefined') {
    log('getCaseList 缺少参数');
    return;
  } else if (typeof params.offset == 'undefined') {
    log('getCaseList 缺少参数');
    return;
  }
  postRequest('Case/getList', { session_key: sessionKey, type_id: params.type_id, offset: params.offset }, success, error)
}

//案例详情
function getCaseDetail(params, success, error) {
  var sessionKey = getSessionKey();
  if (typeof params == 'undefined') {
    log('getCaseDetail 缺少参数');
    return;
  } else if (typeof params.id == 'undefined') {
    log('getCaseDetail 缺少参数');
    return;
  }
  postRequest('Case/detail', { session_key: sessionKey, id: params.id }, success, error)
}

module.exports = {
  formatTime: formatTime,
  login: login,
  addUserInfo: addUserInfo,
  getMyQuestionList: getMyQuestionList,
  getQuestionList: getQuestionList,
  getQuestionDetail: getQuestionDetail,
  getQuestionType: getQuestionType,
  comment: comment,
  uploadImage: uploadImage,
  commitQuestion: commitQuestion,
  getDoctorList: getDoctorList,
  getDoctorDetail: getDoctorDetail,
  getCode: getCode,
  formatDay: formatDay,
  addOrder: addOrder,
  getLateList: getLateList,
  getBookingList: getBookingList,
  getBookingDetail: getBookingDetail,
  getCaseTypes: getCaseTypes,
  getCaseList: getCaseList,
  getCaseDetail: getCaseDetail
}
