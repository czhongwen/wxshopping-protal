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
    num:1,
    pType:
    [
      { pTN: "颜色", pType: ["红色", "白色", "黑色"] },
      { pTN: "材质", pType: ["纯棉", "亚麻"] },
    ],
    actionView:"position:fixed;z-index:520;width:100%;height:1px;bottom:0px;opacity:0.4;background:#eee",
    url: getApp().globalData.url,
  },
  onLoad: function(options) {
    var that = this;
    wx.request({
      url: url +'/product/getById' ,
      method:"post",
      data:{
        id: options.pId
      },
      success: function(res) {
        if(res.data.flag) {
          that.data.switer = [];
          that.data.switer.push(res.data.result.image1);
          that.data.switer.push(res.data.result.image2);
          that.data.switer.push(res.data.result.image3);
          that.data.switer.push(res.data.result.image4);
          that.data.switer.push(res.data.result.image5);
          that.setData({
            switer:that.data.switer,
            pId: res.data.result.id,
            pName: res.data.result.name,
            pInfo: res.data.result.info,
            pPrice: res.data.result.price
          })
          WxParse.wxParse('article', 'html', res.data.result.detail, that, 0);
        } else {
          this.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 3000
          })
        }
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
    let _this = this;
    wx.request({
      url: url + '/cart/addCart',
      data:{
        openId:wx.getStorageSync("openId"),
        productId: _this.data.pId,
        num: _this.data.num
      },
      method:"post",
      success:function(res) {
        console.log(res);
        if (res.data.flag) {
            if (res.data.result) {
              wx.showToast({
                icon:"success",
                title:"添加成功!"
              })
            } else {
              wx.showToast({
                icon: "error",
                title: res.data.msg
              })
            }
        } else {
          wx.showToast({
            icon: "error",
            title: res.data.msg
          })
        }
      }
    })
  },
  add: function(){
    this.setData({
      num:this.data.num + 1
    })
  },
  substruction: function(){
    if (this.data.num > 1) {
        this.setData({
          num:this.data.num - 1
        })
    }
  }
})