    //app.js
//http://localhost
//http://127.0.0.1
//https://www.czhongwen.xyz
App({
  globalData: {
    url: "http://192.168.137.35:8081",
    userInfo: 0,
    width: 0,
    height: 0,
  },
  onLaunch: function() {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    // 登录
    wx.login({
      success: res => {
        //console.log(res.code)
        let _this = this;
        wx.request({
          url: _this.globalData.url + "/login/getOpenId",
          method: "POST",
          data:{
            key: res.code,
          },
          success: function(res) {
            if (res.data.flag) {
              wx.setStorageSync("openId", res.data.result.openid)
            } else {
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 2000
              })
            }
          }
        })
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    //获取设备信息
    var that=this;
    wx.getSystemInfo({
      success: function (res) {
        that.globalData.width = res.screenWidth
        that.globalData.height = res.screenHeight
      }
    })
  },
})