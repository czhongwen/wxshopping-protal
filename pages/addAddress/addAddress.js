var url = getApp().globalData.url;
Page({
  data: {
    region: ['河南省', '信阳市', '浉河区'],
    customItem: '全部',
    name: "",
    phone: "",
    address: "",
    detailAddress: "",
    defalut: true,
    delFlag: true,
    aId: -1,
    msg:""
  },
  onLoad: function(options) {
    this.setData({
      msg: options.msg
    })
    if (options.msg == 'addAddress') {
      wx.setNavigationBarTitle({
        title: '添加地址',
      })
      this.setData({
        aId: wx.getStorageSync("fakeAid")
      })
    } else if (options.msg == 'editor') {
      wx.setNavigationBarTitle({
        title: '修改地址',
      })
      var aId = options.aId
      var address = wx.getStorageSync("editAddress")
      this.setData({
        aId: address.id,
        name: address.name,
        phone: address.phone,
        region: [address.provice, address.city, address.country],
        detailAddress: address.detail,
        address: [address.provice, address.city, address.country],
        delFlag: false,
      })
    }
  },

  name: function(e) {
    this.setData({
      name: e.detail.value
    })
  },
  phone: function(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  bindRegionChange: function(e) {
    var address = []
    for (let i = 0; i < e.detail.value.length; ++i) {
      address[i] = e.detail.value[i]
    }
    this.setData({
      region: e.detail.value,
      address: address
    })
  },
  detailAddress: function(e) {
    this.setData({
      detailAddress: e.detail.value
    })
  },
  clickDefalut: function() {
    if (this.data.defalut == true) {
      this.setData({
        defalut: false,
      })
    } else {
      this.setData({
        defalut: true,
      })
    }
  },
  saveCheck: function() {
    if (this.data.name != "") {
      if (this.data.phone != '') {
        if (this.data.address != "") {
          if (this.data.detailAddress != "") {
            (this.data.defalut) ? this.save(1): this.save(0);
          } else {
            this.msg("请输入详细地址")
          }
        } else {
          this.msg("请选择地址")
        }
      } else {
        this.msg("请输入手机号码")
      }
    } else {
      this.msg("请输入姓名")
    }
  },

  save: function(defaul) {
    console.log(defaul);
    var adresList = wx.getStorageSync("address")
    var obj = {
      id: this.data.aId,
      name: this.data.name,
      phone: this.data.phone,
      provice: this.data.address[0],
      city: this.data.address[1],
      country: this.data.address[2],
      detail: this.data.detailAddress,
      userOpenId:wx.getStorageSync("openId"),
      defaultStatus: defaul
    }
    if (this.data.msg == "addAddress") {
      wx.request({
        url: url + '/address/addAddress',
        data: obj,
        method:"post",
        success:function(res) {
          console.log(res);
        }
      })
    } else if (this.data.msg == "editor") {
      wx.request({
        url: url + '/address/updateAddress',
        data: obj,
        method: "post",
        success: function (res) {
          console.log(res);
        }
      })
    }
    wx.navigateBack({
      url: "../address/address"
    })
  },
  msg: function(msg) {
    wx.showToast({
      title: msg,
      icon: "none",
    })
  },
  del: function() {
    wx.request({
      url: url + '/address/delAddress',
      method: "post",
      data: {
        openId:wx.getStorageSync("openId"),
        id:this.data.aId
      },
      success:function(res) {
        if (res.data.flag) {
          if (res.data.result) {
            wx.navigateBack({
              url: "../address/address"
            })
          }
        }
      }
    })
  },
  onPullDownRefresh: function () {
    if (getCurrentPages().length != 0) {
      //刷新当前页面的数据
      getCurrentPages()[getCurrentPages().length - 1].onLoad()
    }
    wx.stopPullDownRefresh();
  },
  onReachBottom: function () {

  }
})