// pages/myOrders/myOrders.js
Page({
  data: {
    height: getApp().globalData.height,
    width: getApp().globalData.width,
    arr: wx.getStorageSync("carts"),
    index:0,
    arrColor: { one:"color:red;font-size: 3.0vh;border-bottom: 2px solid red;",two:"",three:"",four:""},
    url:getApp().globalData.url,
    orders:[],
    swHight:0,
    stats:"",
  },

  onLoad: function (options) {
  },

  onReady: function () {
  
  },

  onShow: function () {
    var that=this;
    wx.request({
      url: getApp().globalData.url + '/wxshopping/GetOrderServlet',
      data: {
        openId: wx.getStorageSync("openId"),
      },
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res.data);
        var fahuo=[];
        var shouhuo=[];
        var wancheng=[];
        var arr = res.data;
        for(let i=0;i<arr.length;i++){
          if(arr[i].status=="待发货"){
            fahuo.push(arr[i])
          } else if (arr[i].status == "已发货"){
            shouhuo.push(arr[i])
          } else if(arr[i].status == "已收货"){
            wancheng.push(arr[i])
          }
        }
        that.data.orders.push(res.data);
        that.data.orders.push(fahuo);
        that.data.orders.push(shouhuo);
        that.data.orders.push(wancheng);
        that.setData({
          orders: that.data.orders,
        })
        that.countSwHeight(res.data)
      }
    })
  },

  countSwHeight:function(arr){
    var swHeight = 0;
    for (let i = 0; i < arr.length; i++) {
      swHeight += (arr[i].products.length * (0.15 + 0.002) + (0.05 + 0.01)) * this.data.height
    }
    this.setData({
      swHeight: swHeight
    })
  },

  onHide: function () {
  
  },

  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  topView:function(e){
    //console.log(e.currentTarget.dataset.index)
    this.setData({
      index: e.currentTarget.dataset.index
    })
    this.changeColor(e.currentTarget.dataset.index)
  },
  change: function (e) {
    //console.log(e.detail.current)
    this.changeColor(e.detail.current)
  },
  changeColor:function(index){
    var obj = { one: "", two: "", three: "", four: "" };
    switch (index){
      case 0:
        obj.one ="color:red;font-size: 3.0vh;border-bottom: 2px solid red;"
        this.countSwHeight(this.data.orders[0])
        break;
      case 1:
        obj.two = "color:red;font-size: 3.0vh;border-bottom: 2px solid red;"
        this.countSwHeight(this.data.orders[1])
        break;
      case 2:
        obj.three = "color:red;font-size: 3.0vh;border-bottom: 2px solid red;"
        this.countSwHeight(this.data.orders[2])
        break;
      case 3:
        obj.four = "color:red;font-size: 3.0vh;border-bottom: 2px solid red;"
        this.countSwHeight(this.data.orders[3])
        break;
    }
    this.setData({
      arrColor: obj,
    })
  }
})