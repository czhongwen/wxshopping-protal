// pages/address/address.js
Page({
  data: {
    addresList: [],
    addFlag: true,
    url: getApp().globalData.url
  },
  onLoad: function() {
    this.setData({
      addresList: wx.getStorageSync("address")
    })
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
    this.setData({
      addresList: wx.getStorageSync("address")
    })
    if (wx.getStorageSync("address").length == 0) {
      this.setData({
        addFlag: false
      })
    } else {
      this.setData({
        addFlag: true
      })
    }
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
  }
})