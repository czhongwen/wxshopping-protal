
Page({
  data:{
    url: getApp().globalData.url,
    topImgs: [
      'https://yanxuan.nosdn.127.net/cbca7658cd8d4c204188f6b34e1e9556.jpg?imageView&quality=95&thumbnail=1090x310',
      'https://yanxuan.nosdn.127.net/6620afac8d8a83785d356a67cd1c5c21.jpg?imageView&quality=95&thumbnail=1090x310',
      'https://yanxuan.nosdn.127.net/41b0dc4d905015712659fad6a31af5a2.jpg?imageView&quality=95&thumbnail=1090x310',
      'https://yanxuan.nosdn.127.net/97983065bc6e66cea027682feb7a54e6.jpg?imageView&quality=95&thumbnail=1090x310',
      'https://yanxuan.nosdn.127.net/919c7953daf1a3f89473141f3b19dc39.jpg?imageView&quality=95&thumbnail=1090x310',
    ],
    bottomList:[],
    bottomFlag:true,
    height:getApp().globalData.height
  },
  search:function(){
    wx.navigateTo({
      url: '../search/search',
    })
  },
  onShow:function(){
    var that=this;
    wx.request({
      url: that.data.url +'/index/getHot',
      method:"POST",
      success:function(res){
        if (res.data.flag) {
          that.setData({
            bottomList: res.data.result
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        } 
      },
      fail(res) {
        wx.showToast({
          title: 'sorry,系统异常！',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  click:function(e){
    wx.navigateTo({
      url: '../productDetail/productDetail?pId=' + e.currentTarget.dataset.index,
    })
  },
  browseProduct:function(e){

    //这一段很狗血， 哈哈哈，
    let id = 21;
    if (e.currentTarget.dataset.id == 1) {
      id = Math.round(Math.random() * 10) + 9
      id = id >= 19 ? 18 : id;
    } else if (e.currentTarget.dataset.id == 2) {
      id = Math.round(Math.random() * 10) + 57
      id = id >= 71 ? 70 : id;
    } else if (e.currentTarget.dataset.id == 3) {
      id = Math.round(Math.random() * 10) + 19
      id = id >= 31 ? 29 : id;
    } else {

    }
    wx.navigateTo({
      url: '../browseProduct/browseProduct?type=0&' + 'typeId=' + id,
    })
  },
  topNavigation: function(e){
    //这一段也很狗血， 哈哈哈，
    let index = 21;
    if (e.currentTarget.dataset.index == 1) {
      index = Math.round(Math.random() * 10) + 48
      index = index >= 57 ? 56 : index;
    } else if (e.currentTarget.dataset.index == 2) {
      index = Math.round(Math.random() * 10) + 9
      index = index >= 22 ? 21 : index;
    } else if (e.currentTarget.dataset.index == 3) {
      index = Math.round(Math.random() * 10) 
      index = index >= 9 ? 8 : index;
    } else if (e.currentTarget.dataset.index == 4) {
      index = Math.round(Math.random() * 10) + 29
      index = index >= 39 ? 38 : index;
    } else if (e.currentTarget.dataset.index == 5) {
      index = Math.round(Math.random() * 10) + 71
      index = index >= 76 ? 75 : index;
    } else {

    }
    wx.navigateTo({
      url: '../browseProduct/browseProduct?type=0&' + 'typeId=' + index,
    })
  },
  onPullDownRefresh:function(){
    this.onShow();
    wx.stopPullDownRefresh();
  },
  onReachBottom:function(){
    this.setData({
      bottomFlag:false,
    })
  }
})