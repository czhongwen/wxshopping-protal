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
    wx.setStorageSync("address", this.data.addresList)
    wx.navigateTo({
      url: '../addAddress/addAddress?msg=addAddress',
    })
    wx.setStorageSync("addAddressFlag", true)
  },
  editor: function(e) {
    wx.setStorageSync("address", this.data.addresList)
    wx.setStorageSync("editorFlag", true)
    wx.navigateTo({
      url: '../addAddress/addAddress?msg=editor&aId=' + e.currentTarget.dataset.index,
    })
  },
  onShow: function() {
    console.log(1111);
    let _this = this;
    wx.request({
      url: url + '/address/getAddressList',
      data: {
        openId: wx.getStorageSync("openId")
      },
      method:"post",
      success:function(res) {
        console.log(res);
        if (res.data.flag) {
          if (res.data.rows > 0) {
            console.log(2222)
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
      var arr = wx.getStorageSync("address")
      wx.setStorageSync("choiceAddress", arr[e.currentTarget.dataset.indexadd])
      wx.setStorageSync("choiceFlag", false)
      wx.navigateBack({
        url: "../order/order"
      })
    }
  },
})