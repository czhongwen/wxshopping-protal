    //app.js
//http://localhost
//http://127.0.0.1
//https://www.czhongwen.xyz
App({
  globalData: {
    url: "http://192.168.199.166:8081",
    userInfo: 0,
    width: 0,
    height: 0,
  },
  onLaunch: function() {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync("insAddressFlag", false)
    wx.setStorageSync("uptAddressFlag", false)
    wx.setStorageSync("delAddressFlag", false)
    wx.setStorageSync("insAddress", [])
    wx.setStorageSync("uptAddress", [])
    wx.setStorageSync("delAddress", [])
    wx.setStorageSync("fakeAid", -2);
    // 登录
    wx.login({
      success: res => {
        //console.log(res.code)
        wx.request({
          url: "http://192.168.199.166:8081/wxshopping/GetWXOppenIdServlet?type=803&key=" + res.code,
          success: function(res) {
            console.log(res.data.openId)
            wx.setStorageSync("openId", res.data.openId)
            //获取用户购物车
            wx.request({
              url: 'http://192.168.199.166:8081/wxshopping/GetCartsList',
              data: {
                openId: res.data.openId
              },
              method: "GET",
              success: function (res) {
                wx.setStorageSync('carts', res.data)
                wx.setStorageSync("cartFlag", false)
              },
              fail: function (res) {
                wx.showToast({
                  title: '服务器连接出错',
                  icon: "none",
                })
              }
            })
            wx.request({
              url: 'http://192.168.199.166:8081/wxshopping/GetAddressListByopenId',
              data: {
                openId: res.data.openId
              },
              method: "GET",
              success: function (res) {
                wx.setStorageSync('address', res.data)
                wx.setStorageSync("addressFlag", false)
              },
            })
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
        // console.log(that.globalData.width)
        // console.log(that.globalData.height)
      }
    })
  },

  onHide: function() {
    //修改购物车信息
   if(wx.getStorageSync("cartFlag")==true){
     var arr = wx.getStorageSync("carts");
     wx.removeStorageSync("carts")
     var arrPid = [];
     var arrPnum = [];
     for (let i = 0; i < arr.length; i++) {
       arrPid.push(arr[i].pId)
       arrPnum.push(arr[i].pNum)
     }
     wx.request({
       url: 'http://192.168.199.166:8081/wxshopping/AddCart',
       data: {
         arrPid: arrPid,
         arrPnum: arrPnum,
         openId: wx.getStorageSync("openId"),
       },
       method: "POST",
       header: {
         'content-type': 'application/x-www-form-urlencoded'
       },
     })
   }else{
     console.log("不麻烦服务器了")
   }
   //用户修改地址信息,
  if(wx.getStorageSync("addressFlag")){
    
    if (wx.getStorageSync("delAddressFlag")) {
      wx.request({
        url: 'http://192.168.199.166:8081/wxshopping/LoadAddressServlet',
        data: {
          openId: wx.getStorageSync("openId"),
          arrInsFlag: null,
          arrUptFlag: null,
          arrDelFlag: wx.getStorageSync("delAddressFlag"),
          arrDel: JSON.stringify(wx.getStorageSync("delAddress")),
        },
        method: "POST",
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          wx.setStorageSync("delAddress", [])
        }
      })
    }

    if(wx.getStorageSync("insAddressFlag")){
      wx.request({
        url: 'http://192.168.199.166:8081/wxshopping/LoadAddressServlet',
        data: {
          openId: wx.getStorageSync("openId"),
          arrInsFlag: wx.getStorageSync("insAddressFlag"),
          arrIns: JSON.stringify(wx.getStorageSync("insAddress")),
          arrUptFlag: null,
          arrDelFlag: null
        },
        method: "POST",
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          wx.setStorageSync("insAddress", [])
        }
      })
    }

    if (wx.getStorageSync("uptAddressFlag")) {
      wx.request({
        url: 'http://192.168.199.166:8081/wxshopping/LoadAddressServlet',
        data: {
          openId: wx.getStorageSync("openId"),
          arrInsFlag: null,
          arrUptFlag: wx.getStorageSync("uptAddressFlag"),
          arrUpt: JSON.stringify(wx.getStorageSync("uptAddress")),
          arrDelFlag: null,
        },
        method: "POST",
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          wx.setStorageSync("uptAddress", [])
        }
      })
    }
   }else{
     console.log("我也不麻烦服务器了")
   }
  }
})