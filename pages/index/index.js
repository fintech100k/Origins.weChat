//index.js
//获取应用实例
var loadFunc = require("../scanQR/scanQR.js")
const app = getApp()

Page({
  data: {
    motto: 'Hello Origins!',
    userInfo: {},
    hasUserInfo: false,
    isLogin: true,
    signUp: 1,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    username: "",
    password: '123',
    role:['Client','Producer','Admin'],
    roleIndex: 0,
    userRole: ''

  },
  //事件处理函数
  bindViewTap: function() {
    console.log(app.globalData.userInfo)
    wx.showToast({
      title: "" + app.globalData.userInfo,
    })
  },
  /*onShow: function (e) {
    this.setData({
      signUp: e.signUp
    })
  },*/
  onLoad: function (e) {
    this.setData({
      signUp: e.signUp
    })
    var that = this
    console.log("signUp " + that.data.signUp)
  
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  usernameInput: function(e) {
    this.setData({
      username: e.detail.value
    })
  },
  passwordInput: function(e) {
    this.setData({
      password: e.detail.value
    })
    var that = this;
    console.log(that.data.password)
  },
  roleInput: function(e) {
    console.log('选中项为',this.data.role[e.detail.value])
    this.setData({
      roleIndex: e.detail.value,
      userRole: this.data.role[e.detail.value]
    })
  },
  UserSignUpDto: function (username, password, role) {
    this.username = username
    this.password = passoword
    this.role = role
  },
  login: function(e) {
    var that = this
  
    wx.request({
      url: `http://localhost:12494/Account/Login?username=${that.data.username}&password=${that.data.password}`,
      header: {
        'content-type': 'application/json', // 默认值 
      },
      method: 'GET',
      success: function (res) {
        console.log(res)
        app.globalData.token = res.data.token
        if(res.data.role != 'Client'){
          app.globalData.isProducer = 1 //
        }else{
          app.globalData.isProducer = 0 //
        }

        console.log(app.globalData.isProducer)

        wx.showToast({
          title: '登录成功',
          icon: 'sucess',
          duration: 2000
        })

        //调用scanQR界面onShow强制初始化
        wx.switchTab({
          url: '../scanQR/scanQR',
          success: function (e) {
            var page = getCurrentPages().pop();
            if (page == undefined || page == null) return;
            page.onShow();
          }
        })
      },
      fail: function (e) {
        console.log(e)
      },
      complete: function () {
        /*wx.switchTab({
          url: '../profile/profile',
        })*/
      }
    })
    app.globalData.isLogin = true
  },
  signUp: function(e) {
    var that = this
    console.log(that.data.username + " " + that.data.password)
    wx.request({
      url: 'http://127.0.0.1:12494/Account/SignUp',
      header: {
        'content-type': 'application/json' // 默认值  
      },
      
      data: JSON.stringify({
        username:that.data.username, 
        password:that.data.password,
        role:that.data.userRole}),
      method: 'POST',
      success: function (res) {
        console.log('token ' + res.data.token)
        app.globalData.token = res.data.token
        
        wx.showToast({
          title: '注册成功',
          icon: 'sucess',
          duration: 2000
        })
      },
      fail: function (e) {
        console.log(e)
      },
      complete: function () {
        wx.switchTab({
          url: '../profile/profile',
        })
      }
    })
  }
})
