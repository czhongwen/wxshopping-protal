// pages/address/address.js
var url = getApp().globalData.url;
Page({
  data: {
    addresList: [],
    addFlag: true,
    url: getApp().globalData.url,
  },
  onLoad: function() {
    this.setData({
      height: getApp().globalData.height
    })
  },
  addAddress: function() {
    wx.navigateTo({
      url: '../addAddress/addAddress?msg=addAddress',
    })
  },
  editor: function(e) {
    wx.setStorageSync("editAddress", this.data.addresList[e.currentTarget.dataset.index])
    wx.navigateTo({
      url: '../addAddress/addAddress?msg=editor&aId=' + e.currentTarget.dataset.index,
    })
  },
  onShow: function() {
    let _this = this;
    wx.request({
      url: url + '/address/getAddressList',
      data: {
        openId: wx.getStorageSync("openId")
      },
      method:"post",
      success:function(res) {
        if (res.data.flag) {
          if (res.data.rows > 0) {
            _this.setData({
              addresList: res.data.result              
            })
          }
        } else {
          
        }
      }
    })
  },
  choice: function(e) {
    if (wx.getStorageSync("choiceFlag")) {
      wx.setStorageSync("choiceAddress", this.data.addresList[e.currentTarget.dataset.indexadd])
      wx.setStorageSync("choiceFlag", false)
      wx.navigateBack({
        url: "../order/order"
      })
    }
  },
  onPullDownRefresh:function() {
    this.onShow();
  }
})