var WxParse = require('../wxParse/wxParse.js');
var url = getApp().globalData.url; 
Page({
  data: {
    style: "",
    switer: [],
    imageIndex: 1,
    pName: '',
    pInfo: '',
    pPrice: "",
    pId: 0,
    pType:
    [
      { pTN: "颜色", pType: ["红色", "白色", "黑色"] },
      { pTN: "材质", pType: ["纯棉", "亚麻"] },
    ],
    actionView:"position:fixed;z-index:520;width:100%;height:1px;bottom:0px;opacity:0.4;background:#eee",
    url: getApp().globalData.url,
  },
  onLoad: function(options) {
    //console.log(options.pId)
    var that = this;
    wx.request({
      url: url +'/wxshopping/GetProductDetailById?pId=' + options.pId,
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        //console.log(res.data)
        that.setData({
          switer: res.data.pic,
          pId: res.data.pId,
          pName: res.data.pName,
          pInfo: res.data.pInfo,
          pPrice: res.data.pPrice
        })
        var article = res.data.pDetail;
        WxParse.wxParse('article', 'html', article, that, 5);
      }
    })
  },
  home: function() {
    wx.switchTab({
      url: '../index/index',
    })
  },
  service: function() {
    console.log("还没有写好")
  },
  carts: function() {
    wx.switchTab({
      url: '../carts/carts',
    })
  },
  buyNow: function() {
    this.setData({
      style: "height:65%;bottom:10px;",
      actionView:"height:100%;"
    })
  },
  changImage: function(e) {
    this.setData({
      imageIndex: e.detail.current + 1
    })
  },

  // previewImage: function(e) {
  //   var currentImg = e.currentTarget.dataset.imagesrc;
  //   wx.previewImage({
  //     current: currentImg,
  //     urls: this.data.switer
  //   })
  // },

  shutdown: function() {
    this.setData({
      style: "height:1px;bottom:10px;",
      actionView: "height:1px;"
    })
  },

  addCarts: function() {
    var arr=[],
    arr = wx.getStorageSync("carts")
    var flag = true;
    if(arr.length==0){
      flag = true
    }else{
      for (let i = 0; i < arr.length; i++) {
        if (this.data.pId == arr[i].pId) {
          flag = false
          break;
        } else {
          flag = true
        }
      }
    }
    if (flag) {
      var obj = {
        pId: this.data.pId,
        pName: this.data.pName,
        pDetail: this.data.pInfo,
        pPrice: this.data.pPrice,
        pImage: this.data.switer[0],
        pNum:1,
        flag: false,
        pStylr: ""
      }
      arr.push(obj)
      wx.setStorageSync("carts", arr)
      wx.showToast({
        title: '添加成功!',
        icon:"none",
      })
      wx.setStorageSync("cartFlag", true)
    }else{
      wx.showToast({
        title: '购物车已存在该商品!',
        icon: "none",
      })
    }
  }
})