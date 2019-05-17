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
    url: getApp().globalData.url,
    order:null,
    typeId:null,
    bottomFlag:true,
    count: 0,
    offset:0,
    limit: 8,
  },
  onLoad: function(options) {
    this.setData({
      width: getApp().globalData.width / 2
    })
    var that = this
    if (options.type == 0) {
      that.data.typeId = options.typeId;
      this.sort();
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
      order:null,
    })
    this.sort();
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
        order:"ASC",
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
        order:"DESC",
      })
    }
    this.sort();
  },

  sort: function() {
    var that = this
    wx.request({
      url: url + '/product/getProductList',
      method: "post",
      data: {
        typeId: that.data.typeId,
        offset: 0,
        limit: that.data.limit,
        order: that.data.order,
      },
      success: function (res) {
        if (!res.data.flag) {
          wx.navigateBack({
            delta: 1,
          })
        } else {
          that.setData({
            arr: res.data.result.list,
            count:res.data.result.count,
            offset:that.data.limit,
          })
        }
      }
    })
  },

  onReachBottom: function() {
    if (this.data.count <= this.data.offset ){
      this.setData({
        bottomFlag: false,
      })
      return;
    }
    var that = this
    wx.showNavigationBarLoading()
    wx.request({
      url: url + '/product/getProductList',
      method: "post",
      data: {
        typeId: that.data.typeId,
        offset: that.data.offset,
        limit: that.data.limit,
        order: that.data.order,
      },
      success: function (res) {
        if (!res.data.flag) {
          console.log(res);
          wx.navigateBack({
            delta: 1,
          })
        } else {
          that.setData({
            arr: that.data.arr.concat(res.data.result.list)
          })
          that.data.offset = that.data.offset + that.data.limit;
        }
        wx.hideNavigationBarLoading();
      }
    })
  },
  onPullDownRefresh: function () {
    if (getCurrentPages().length != 0) {
      //刷新当前页面的数据
      getCurrentPages()[getCurrentPages().length - 1].onLoad()
    }
    wx.stopPullDownRefresh();
  },
})