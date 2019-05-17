var url = getApp().globalData.url;
Page({
  data:{
    type: [],
    obj:{style:"",name:""},
    index:"小黑",
    url : getApp().globalData.url,
  },
  onLoad:function(){
    var that=this;
    wx.request({
      url: url +'/productType/getAllType',
      method:"post",
      success:function(res){
        if(res.data.flag) {
          that.setData({
            type: res.data.result,
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  catchTouchMove: function (res) {
    return false
  },
  change:function(e){
    this.changeCss(e.currentTarget.dataset.index)
  },
  change1:function(e){
    this.changeCss(e.detail.current)
  },
  changeCss: function (index) {
    if (this.data.index != "小黑" && this.data.index != index) {
      this.data.type[this.data.index].style = "border-bottom:0px red solid;color:black;"
      this.setData({
        type: this.data.type
      })
    }
    this.data.type[index].style = "border-bottom:1px red solid;color:red;"
    this.setData({
      type: this.data.type,
      index: index
    })
  },
  browse:function(e){
    wx.navigateTo({
      url: '../browseProduct/browseProduct?type=0&'+'typeId='+e.currentTarget.dataset.id,
    })
  },
  onPullDownRefresh:function(){
    if (getCurrentPages().length != 0) {
      //刷新当前页面的数据
      getCurrentPages()[getCurrentPages().length - 1].onLoad()
    }
    wx.stopPullDownRefresh();
  },
  onReachBottom:function(){
    
  }
})