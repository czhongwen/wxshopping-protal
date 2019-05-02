
Page({
  data:{
    orders:[],
    numPrice:[],
    discount:20,
    name:"",
    phone:"",
    address:"",
    type:null,
    addressId:null,
    url: getApp().globalData.url,
    addressFlag: true,
  },
  onLoad:function() {
    this.setData({
      orders:wx.getStorageSync("orders")
    })
    let orders = wx.getStorageSync("orders");
    var numPrice=0;
    for (let i = 0; i < orders.length; ++i) {
      numPrice = numPrice + orders[i].price * orders[i].num
    }
    this.data.numPrice[0] = numPrice;
    this.data.numPrice[1] = numPrice-this.data.discount;
    this.setData({
      numPrice: this.data.numPrice
    })
  },
  onShow:function(){
    if (wx.getStorageSync("choiceAddress") != "") {
      var obj = wx.getStorageSync("choiceAddress")
      this.setData({
        addressFlag: true,
        name: obj.name,
        phone: obj.phone,
        address: obj.provice+obj.city+obj.country+obj.detail,
        addressId:obj.id,
      })
    } else {
      let _this = this;
      wx.request({
        url: this.data.url + '/address/getDefault',
        data: {
          openId: wx.getStorageSync("openId")
        },
        method: 'post',
        dataType: 'json',
        responseType: 'text',
        success: function (res) {
          if (res.data.flag) {
            if (res.data.result != null) {
              let data = res.data.result;
              _this.setData({
                name: data.name,
                phone: data.phone,
                address: data.provice + data.city + data.detail,
                addressId: data.id,
                addressFlag: true,
              })
            } else {
              _this.setData({
                addressFlag: false,
              })
            }
          }
        },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
  },
  pay:function(){
    this.checkAddres()
    var that = this
    if (that.data.addressId == null || that.data.addressId < 0) {
      return wx.showToast({
        title: '您未填写收货地址!',
        icon: "none",
        duration: 3000
      })
    }
    var arr=wx.getStorageSync("orders")
    var orders=[];
    var cartIds=[];
    for(let i=0;i<arr.length;i++){
      var obj = { productId:0,num:0};
      obj.productId = arr[i].id;
      obj.num=arr[i].num
      cartIds.push(arr[i].id)
      orders.push(obj)
    }
    wx.request({
      url: that.data.url +'/order/addOrders',
      method:"POST",
      data:{
        cartIds: cartIds,
        list: orders,
        openId:wx.getStorageSync("openId"),
        addressId: that.data.addressId,
      },
      success: function (res) {
        if (res.data.flag) {
          if(res.data.result) {
            wx.redirectTo({
              url: '../myOrders/myOrders',
            })
            wx.removeStorageSync("orders")
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: "none",
              duration: 3000
            })
          }
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: "none",
            duration: 3000
          })
        }
      }
    })
  },
  checkAddres:function(){
    var obj = wx.getStorageSync("choiceAddress");
    if(wx.getStorageSync("insAddressFlag")){
      if (wx.getStorageSync("insAddress").length > 0) {
        var arr = wx.getStorageSync("insAddress");
        for (let i = 0; i < arr.length; ++i) {
          if (obj.aId == arr[i].aId) {
            arr.splice(i, 1);
            break;
          }
        }
        wx.setStorageSync("insAddress", arr)
        if (arr.length == 0) {
          wx.setStorageSync("insAddressFlag", false);
        }
        this.setData({
          type: "insAddress"
        })
      }
    }

    if(wx.getStorageSync("uptAddressFlag")){
      if (wx.getStorageSync("uptAddress").length > 0) {
        var arr = wx.getStorageSync("uptAddress");
        for (let i = 0; i < arr.length; ++i) {
          if (obj.aId == arr[i].aId) {
            arr.splice(i, 1);
            break;
          }
        }
        wx.setStorageSync("uptAddress", arr)
        if (arr.length == 0) {
          wx.setStorageSync("uptAddressFlag", false);
        }
        this.setData({
          type: "uptAddress"
        })
      }
    }
  },
  choice:function(){
    wx.setStorageSync("choiceFlag", true)
    wx.navigateTo({
      url: '../address/address',
    })
  }
})