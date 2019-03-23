
Page({
  data:{
    url: getApp().globalData.url,
    topImgs: [
      'https://yanxuan.nosdn.127.net/75bb6a4e55b17bdc8a81bac6ea39b120.jpg?quality=95&thumbnail=1920x420&imageView',
      'https://yanxuan.nosdn.127.net/a99ef1ec866bd319b54137213c0ce136.jpg?quality=95&thumbnail=1920x420&imageView',
      'https://yanxuan.nosdn.127.net/6e5a44a36febd49c754491e2788e84c5.jpg?quality=95&thumbnail=1920x420&imageView',
      'https://yanxuan.nosdn.127.net/aa3867a78c8851aa9f0fb7e0fbb7390c.jpg?quality=95&thumbnail=1920x420&imageView',
      'https://yanxuan.nosdn.127.net/f4effede20eace873fc30ee6364ff4e2.jpg?quality=95&thumbnail=1920x420&imageView',
      'https://yanxuan.nosdn.127.net/fe647a9a27356d3b02d57cb0656a6c34.jpg?quality=95&thumbnail=1920x420&imageView',
      'https://yanxuan.nosdn.127.net/067c1d07db7a336163427f482dd528ea.jpg?quality=95&thumbnail=1920x420&imageView'
    ],
    bottomList:[],
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
  }
})