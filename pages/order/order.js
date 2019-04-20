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
    var arr=wx.getStorageSync("orders")
    var orders=[];
    var cartIds=[];
    for(let i=0;i<arr.length;i++){
      var obj = { productId:0,num:0};
      obj.productId = arr[i].productId;
      obj.num=arr[i].num
      cartIds.push(arr[i].id)
      orders.push(obj)
    }
    var that=this
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
        that.checkCarts()
        wx.redirectTo({
          url: '../myOrders/myOrders',
        })
      }
    })
  },
  checkCarts:function(){
    var arr=wx.getStorageSync("orders")
    var carts=wx.getStorageSync("carts")
    for(let i=0;i<arr.length;i++){
      for(let j=0;j<carts.length;j++){
        if (arr[i].pId==carts[j].pId){
          carts.splice(j,1)
          break;
        }
      }
    }
    if(carts.length==0){
      carts=[];
    }
    wx.setStorageSync("carts", carts)
    wx.setStorageSync("addressFlag", true)
    wx.removeStorageSync("orders")
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