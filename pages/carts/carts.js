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

  touchStart: function (e) {
    this.setData({
      startX: e.touches[0].clientX
    })
  },

  touchMove: function (e) {
    var moveX = e.touches[0].clientX;
    var distans = this.data.startX - moveX
    if (distans > 385) {
      distans = 380
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

  /**
   * 商品详情
   */
  detail: function (e) {
    wx.navigateTo({
      url: '../productDetail/productDetail?pId=' + e.currentTarget.dataset.pid,
    })
  },

  /**
   * 选中所有
   */
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

  /**
   * 选中商品
   */
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

  /**
   * 商品数量
   */
  productsNum: function () {
    var index = 0;
    var numPrice = 0;
    for (let i = 0; i < this.data.cartList.length; ++i) {
      if (this.data.cartList[i].flag == true) {
        index++;
        numPrice = numPrice + this.data.cartList[i].price * this.data.cartList[i].num
      }
    }
    this.data.cartNumPrice[0] = index
    this.data.cartNumPrice[1] = numPrice
    this.setData({
      cartNumPrice: this.data.cartNumPrice
    })
  },

/**
 * 增加商品数量
 */
  addNum: function (e) {
    var num = this.data.cartList[e.currentTarget.dataset.cartindex].num
    this.data.cartList[e.currentTarget.dataset.cartindex].num = num + 1;
    this.setData({
      cartList: this.data.cartList,
    })
    if (this.data.cartList[e.currentTarget.dataset.cartindex].flag) {
      this.data.cartNumPrice[1] = this.data.cartNumPrice[1] + this.data.cartList[e.currentTarget.dataset.cartindex].price
      this.setData({
        cartNumPrice: this.data.cartNumPrice
      })
    }
  },
  /**
   * 删减商品数量
   */
  minusNum: function (e) {
    var num = this.data.cartList[e.currentTarget.dataset.cartindex].num
    if (num > 1) {
      this.data.cartList[e.currentTarget.dataset.cartindex].num = num - 1;
      this.setData({
        cartList: this.data.cartList,
      })
      if (this.data.cartList[e.currentTarget.dataset.cartindex].flag != false) {
        this.sumNumPric();
      }
    }
  },
  /**
   * 删除商品
   */
  deleteCart: function (e) {
    let _this = this;
    console.log(this.data.cartList[e.currentTarget.dataset.cartindex].id);
    wx.request({
      url: url + '/cart/delCartById',
      method: "post",
      data:{
        id: _this.data.cartList[e.currentTarget.dataset.cartindex].id
      },
      success: function(res) {
        console.log(res);
        if(res.data.flag) {
          if(res.data.result) {
            _this.data.cartList.splice(e.currentTarget.dataset.cartindex, 1)
            _this.setData({
              cartList: _this.data.cartList,
            })
            _this.sumNumPric();
            if (_this.data.cartList.length == 0) {
              _this.setData({
                viewFlag: false,
              })
            }
          }
        } else {
          console.log("系统异常!");
        }
      },
    })
  },

  /**
   * 计算出总价
   */
  sumNumPric: function () {
    this.setData({
      cartNumPrice: []
    })
    var index = 0;
    var numPrice = 0;
    for (let i = 0; i < this.data.cartList.length; ++i) {
      if (this.data.cartList[i].flag == true) {
        index++;
        numPrice = numPrice + this.data.cartList[i].price * this.data.cartList[i].num
      }
    }
    this.data.cartNumPrice[0] = index
    this.data.cartNumPrice[1] = numPrice
    this.setData({
      cartNumPrice: this.data.cartNumPrice
    })
  },

  /**
   * 当用户全选时样式
   */
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
    if (flag) {
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

  /**
   * 用户下单
   */
  order: function () {
    var orders = [];
    var flag = false;
    for (let i = 0; i < this.data.cartList.length; ++i) {
      if (this.data.cartList[i].flag == true) {
        orders.push(this.data.cartList[i])
        flag = true;
      }
    }
    console.log(orders);
    if (flag) {
      wx.setStorageSync("orders", orders);
      wx.navigateTo({
        url: '../order/order',
      })
    }
  },

  /**
   * 离开页面将用户的购物车提交
   */
  onHide: function () {
  },

  /**
   * 页面渲染前请求一次接口
   */
  onShow: function () {
    var that = this;

    that.setData({
      allCheckFlag: false,
      startX: 0,
      index: "小黑",
      cartNumPrice: [0, 0],
      cartList: [],
      viewFlag: false,
      height: 0,
      chooseFlag: true,
      orderStyle: "",
    })

    wx.request({
      url: url + '/cart/getCarts',
      data: {
        openId: wx.getStorageSync("openId"),
      },
      method: "post",
      success: function (res) {
        if (res.data.flag) {
          if (res.data.result == null || res.data.result.length == 0) {
            that.setData({
              viewFlag: false,
            })
          } else {
            that.setData({
              viewFlag: true,
              cartList: res.data.result,
            })
          }
        } 
      }
    })
    this.setData({
      height: getApp().globalData.height,
    })
  },
})