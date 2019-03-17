Page({
  data: {
    flag:false,
    userInfo:[],
    type:
    [
      { topImage: "../icons/dingdan.png", typeName: "我的订单", bottomImage: "../icons/arrow-right.png" },
      { topImage: "../icons/jifen.png", typeName: "我的积分", bottomImage: "../icons/arrow-right.png" },
      { topImage: "../icons/tuihuanhuo.png", typeName: "退货/售后", bottomImage: "../icons/arrow-right.png" },
      { topImage: "../icons/youhuijuan.png", typeName: "优惠券", bottomImage: "../icons/arrow-right.png" },
      { topImage: "../icons/hongbao.png", typeName: "红包", bottomImage: "../icons/arrow-right.png" },
      { topImage: "../icons/map.png", typeName: "地址管理", bottomImage: "../icons/arrow-right.png" },
      { topImage: "../icons/service.png", typeName: "联系客服", bottomImage: "../icons/arrow-right.png" },
      { topImage: "../icons/help.png", typeName: "帮助中心", bottomImage: "../icons/arrow-right.png" },
    ]
  },
  onLoad:function(){
    if (getApp().globalData.userInfo!=""){
      this.setData({
        flag:true,
        userInfo: getApp().globalData.userInfo
      })
    }else{
      this.setData({
        flag: false,
      })
    }
  },
  onGetUserInfo: function (e) {
    this.setData({
      userInfo: e.detail.userInfo,
      flag: true,
    })
    wx.setStorageSync("user", this.data.userInfo)
  },

  choose:function(e){
    //console.log(e.currentTarget.dataset.index)
    switch (e.currentTarget.dataset.index){
      case 0:
          wx.navigateTo({
            url: '../myOrders/myOrders',
          })
          break;
      case 1:
        break;
      case 2:
        break;
      case 3:
        break;
      case 4:
        break;
      case 5:
        wx.navigateTo({
          url: '../address/address',
        })
        break;
      case 6:
        break;
      case 7:
        break;
    }
  }
})