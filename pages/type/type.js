var url = getApp().globalData.url;
Page({
  data:{
    type: [],
    obj:{style:"",name:""},
    index:"小黑",
    obj1: { topPic: "", title: "", arr:[]},
    arr:[],
    obj2:{image:"",name:"",id:""},
    typeList:[],
    url : getApp().globalData.url,
  },
  onLoad:function(){
    var that=this;
    wx.request({
      url: url +'/wxshopping/GetTypeServlet',
      success:function(res){
        //console.log(res.data)
        that.setData({
          type: res.data.type,
          typeList: res.data.typeList
        })
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
    //console.log(e.detail.current)
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
    //console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../browseProduct/browseProduct?type=0&'+'msg='+e.currentTarget.dataset.id,
    })
  }
})