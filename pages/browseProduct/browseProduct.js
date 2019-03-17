var url = getApp().globalData.url;
Page({
  data: {
    no: 0,
    arr: [],
    width: 0,
    style1: "",
    style2: "",
    style3: "",
    style4: "",
    flag1: true,
    flag2: true,
    clickflag: true,
    typeNum: 0,
    typeArr: [],
    findArr: [],
    url: getApp().globalData.url,
  },
  onLoad: function(options) {
    this.setData({
      width: getApp().globalData.width / 2
    })
    var that = this
    if (options.type == 0) {
      wx.request({
        url: url + '/wxshopping/FindProductByType?typeNum=' + options.msg + '&no=' + that.data.no,
        success: function(res) {
          if (res.data.result == "empty") {
            wx.navigateBack({
              url: "../browseProduct/browseProduct"
            })
          }
          that.setData({
            arr: res.data.result,
            typeArr: res.data.result,
            typeNum: options.msg,
            no: that.data.no + 8,
          })
        }
      })
    } else if (options.type == 1) {
      //console.log(options.msg)
    }
  },

  detail: function(e) {
    wx.navigateTo({
      url: '../productDetail/productDetail?pId=' + e.currentTarget.dataset.id,
    })
  },
  multiple: function() {
    this.setData({
      style1: "color:red;",
      style2: "",
      style3: "",
      style4: "",
      flag1: true,
      flag2: true,
      arr: this.data.typeArr,
    })
  },

  price: function() {
    if (this.data.clickflag == true) {
      this.setData({
        style1: "",
        style2: "color:red;",
        style3: "color:red;",
        style4: "",
        flag1: false,
        flag2: true,
        clickflag: false,
      })
    } else {
      this.setData({
        style1: "",
        style2: "color:red;",
        style3: "",
        style4: "color:red;",
        flag1: true,
        flag2: false,
        clickflag: true,
      })
    }
    this.sort()
  },

  sort: function() {
    var that = this
    wx.request({
      url: url + 'SortProduct',
      data: {
        flag: that.data.clickflag,
        arrs: that.data.arr.length,
        typeNum: that.data.typeNum,
      },
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        that.setData({
          arr: [],
          arr: res.data.result
        })
      }
    })
  },

  onReachBottom: function() {
    wx.showNavigationBarLoading()
    var that = this
    wx.request({
      url: url + 'FindProductByType?typeNum=' + (that.data.typeNum) + '&no=' + that.data.no,
      success: function(res) {
        if (res.data.result != "empty") {
          var temp = that.data.arr.concat(res.data.result)
          that.setData({
            arr: temp,
            typeArr: temp,
            no: that.data.no + 8,
          })
        }
        wx.hideNavigationBarLoading();
      }
    })
  },
})