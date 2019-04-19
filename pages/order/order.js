Page({
  data:{
    orders:[],
    numPrice:[],
    discount:20,
    name:"",
    phone:"",
    address:"",
    type:null,
    url: getApp().globalData.url,
  },
  onLoad:function() {
    wx.request({
      url: this.data.url + '/address/getDefault',
      data: {
        openId: wx.getStorageSync("openId")
      },
      method: 'post',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        console.log(res);
      },
      fail: function(res) {},
      complete: function(res) {},
    })
    this.setData({
      orders:wx.getStorageSync("orders")
    })
    var numPrice=0;
    for (let i = 0; i < this.data.orders.length; ++i) {
      numPrice = numPrice + this.data.orders[i].pPrice * this.data.orders[i].pNum
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
        address: obj.province+obj.city+obj.county+obj.detail
      })
    } else {
      var arr=wx.getStorageSync("address")
      wx.setStorageSync("choiceAddress", arr[0])
      this.setData({
        name: arr[0].name,
        phone: arr[0].phone,
        address: arr[0].province + arr[0].city + arr[0].county + arr[0].detail
      })
    }
  },
  pay:function(){
    this.checkAddres()
    var arr=wx.getStorageSync("orders")
    var orders=[];
    for(let i=0;i<arr.length;i++){
      var obj={pId:0,num:0};
      obj.pId=arr[i].pId;
      obj.num=arr[i].pNum
      orders.push(obj)
    }
    var that=this
    wx.request({
      url: that.data.url+'/wxshopping/LoadOrders',
      data: {
        openId: wx.getStorageSync("openId"),
        type: that.data.type,
        orders: JSON.stringify(orders),
        address: JSON.stringify(wx.getStorageSync("choiceAddress")),
      },
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
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