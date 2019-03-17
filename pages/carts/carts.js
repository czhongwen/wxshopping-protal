var flag = true;
var url = getApp().globalData.url;
Page({
  data: {
    allCheckFlag: false,
    startX: 0,
    index: "小黑",
    cartNumPrice: [0, 0],
    cartList: [],
    viewFlag: false,
    height: 0,
    chooseFlag: true,
    orderStyle: "",
    url: getApp().globalData.url,
  },

  onLoad: function () {
    if (wx.getStorageSync("carts").length == 0) {
      this.setData({
        viewFlag: false,
      })
    } else {
      this.setData({
        viewFlag: true,
        cartList: wx.getStorageSync("carts"),
      })
    }
    this.setData({
      height: getApp().globalData.height,
    })
  },

  touchStart: function (e) {
    this.setData({
      startX: e.touches[0].clientX
    })
  },

  touchMove: function (e) {
    var moveX = e.touches[0].clientX;
    var distans = this.data.startX - moveX
    if (distans > 385) {
      distans = 384
    }
    this.data.cartList[e.currentTarget.dataset.index].pStyle = "left:-" + distans + "px";
    this.setData({
      cartList: this.data.cartList
    })
  },

  touchEnd: function (e) {
    var width = 0;
    wx.getSystemInfo({
      success: function (res) {
        width = res.windowWidth
      }
    })
    var delWidth = width * (0.3) / 2

    //把其他行的删除按钮隐藏
    if (this.data.index != "小黑" && this.data.index != e.currentTarget.dataset.index) {
      this.data.cartList[this.data.index].pStyle = "left:0px;";
    }

    var move = this.data.startX - e.changedTouches[0].clientX
    if (move > 0 && move < delWidth) {
      this.data.cartList[e.currentTarget.dataset.index].pStyle = "left:0px;";
      this.setData({
        cartList: this.data.cartList
      })
    } else if (move > delWidth) {
      this.data.cartList[e.currentTarget.dataset.index].pStyle = "left:-" + (delWidth * 2 - 2) + "px";
      this.data.index = e.currentTarget.dataset.index
      this.setData({
        cartList: this.data.cartList
      })
    }
  },


  detail: function (e) {
    wx.navigateTo({
      url: '../productDetail/productDetail?pId=' + e.currentTarget.dataset.pid,
    })
  },


  choseAll: function () {
    for (var i = 0; i < this.data.cartList.length; ++i) {
      this.data.cartList[i].flag = !this.data.allCheckFlag;
      this.setData({
        cartList: this.data.cartList
      })
    }
    this.data.allCheckFlag = !this.data.allCheckFlag;
    this.productsNum()
    this.style()
  },

  sigleCheck: function (e) {
    if (this.data.cartList[e.currentTarget.dataset.cartindex].flag) {
      this.data.cartList[e.currentTarget.dataset.cartindex].flag = false;
    } else {
      this.data.cartList[e.currentTarget.dataset.cartindex].flag = true;
    }
    this.setData({
      cartList: this.data.cartList,
    })
    for (let i = 0; i < this.data.cartList.length; i++) {
      if (this.data.cartList[i].flag == false) {
        this.data.allCheckFlag = false
        break;
      } else {
        this.data.allCheckFlag = true
      }
    }
    this.setData({
      allCheckFlag: this.data.allCheckFlag
    })
    this.productsNum()
    this.style()
  },

  productsNum: function () {
    var index = 0;
    var numPrice = 0;
    for (let i = 0; i < this.data.cartList.length; ++i) {
      if (this.data.cartList[i].flag == true) {
        index++;
        numPrice = numPrice + this.data.cartList[i].pPrice * this.data.cartList[i].pNum
      }
    }
    this.data.cartNumPrice[0] = index
    this.data.cartNumPrice[1] = numPrice
    this.setData({
      cartNumPrice: this.data.cartNumPrice
    })
  },

  addNum: function (e) {
    var num = this.data.cartList[e.currentTarget.dataset.cartindex].pNum
    this.data.cartList[e.currentTarget.dataset.cartindex].pNum = num + 1;
    this.setData({
      cartList: this.data.cartList,
    })
    if (this.data.cartList[e.currentTarget.dataset.cartindex].flag != false) {
      this.data.cartNumPrice[1] = this.data.cartNumPrice[1] + this.data.cartList[e.currentTarget.dataset.cartindex].pPrice
      this.setData({
        cartNumPrice: this.data.cartNumPrice
      })
    }
    wx.setStorageSync("cartFlag", true)
  },

  minusNum: function (e) {
    var num = this.data.cartList[e.currentTarget.dataset.cartindex].pNum
    if (num > 1) {
      this.data.cartList[e.currentTarget.dataset.cartindex].pNum = num - 1;
      this.setData({
        cartList: this.data.cartList,
      })
      if (this.data.cartList[e.currentTarget.dataset.cartindex].flag != false) {
        this.sumNumPric();
      }
    }
    wx.setStorageSync("cartFlag", true)
  },

  deleteCart: function (e) {
    this.data.cartList.splice(e.currentTarget.dataset.cartindex, 1)
    this.setData({
      cartList: this.data.cartList,
    })
    this.sumNumPric();
    wx.setStorageSync("cartFlag", true)
    if (this.data.cartList.length == 0) {
      this.setData({
        viewFlag: false,
      })
    }
  },

  sumNumPric: function () {
    this.setData({
      cartNumPrice: []
    })
    var index = 0;
    var numPrice = 0;
    for (let i = 0; i < this.data.cartList.length; ++i) {
      if (this.data.cartList[i].flag == true) {
        index++;
        numPrice = numPrice + this.data.cartList[i].pPrice * this.data.cartList[i].pNum
      }
    }
    this.data.cartNumPrice[0] = index
    this.data.cartNumPrice[1] = numPrice
    this.setData({
      cartNumPrice: this.data.cartNumPrice
    })
  },

  style: function () {
    var flag = false;
    for (let i = 0; i < this.data.cartList.length; i++) {
      if (this.data.cartList[i].flag == true) {
        flag = true
        break;
      } else {
        flag = false
      }
    }
    if (flag == true) {
      this.setData({
        chooseFlag: false,
        orderStyle: "background:red",
      })
    } else {
      this.setData({
        chooseFlag: true,
        orderStyle: "",
      })
    }
  },
  order: function () {
    var orders = [];
    var flag = false;
    for (let i = 0; i < this.data.cartList.length; ++i) {
      if (this.data.cartList[i].flag == true) {
        orders.push(this.data.cartList[i])
        flag = true;
      }
    }
    if (flag == true) {
      wx.setStorageSync("orders", orders);
      wx.navigateTo({
        url: '../order/order',
      })
    }
  },
  onHide: function () {
    wx.setStorageSync("carts", this.data.cartList)
  },
  onShow: function () {
    if (wx.getStorageSync("carts").length > 0) {
      this.setData({
        cartList: wx.getStorageSync("carts"),
        viewFlag: true,
      })
    } else {
      this.setData({
        viewFlag: false,
      })
    }
  },
})