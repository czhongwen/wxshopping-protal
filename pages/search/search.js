var url = getApp().globalData.url; 
Page({
  data:{
    keys:[],
    tishi:"请输入查询商品名称",
    selectKey:"",
    keysFlag:true,
    delFlag:true,
  },
  key:function(e){
    this.setData({
      tishi: "",
      keysFlag: false,
      delFlag:false,
    })
    if (e.detail.value==''){
      this.setData({
        delFlag: true,
        tishi: "请输入查询商品名称",
      })
    }
    var that=this;
    wx.request({
      url: 'http://suggest.taobao.com/sug?extras=1&code=utf-8&q='+e.detail.value,
      header: {'content-type': 'application/json' },
      success:function(res){
          //console.log(res.data.result);
          that.setData({
            keys:res.data.result  
          })
      }
    })
  },
  search:function(e){
    //console.log()
    
  },
  delSelectKey:function(){
    this.setData({
      selectKey: "",
      keysFlag: true,
      delFlag: true,
      tishi:"请输入查询商品名称"
    })
  },
  selcetKey:function(e){
    this.setData({
      selectKey: e.currentTarget.dataset.key,
      keysFlag: true,
      delFlag: false,
    })
  }
})