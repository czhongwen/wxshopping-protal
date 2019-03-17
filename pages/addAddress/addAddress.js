Page({
  data: {
    region: ['河南省', '信阳市', '浉河区'],
    customItem: '全部',
    name: "",
    phone: "",
    address: "",
    detailAddress: "",
    defalut: false,
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
      var arr = wx.getStorageSync("address")
      this.setData({
        aId: arr[aId].aId,
        name: arr[aId].name,
        phone: arr[aId].phone,
        region: [arr[aId].province, arr[aId].city, arr[aId].county],
        detailAddress: arr[aId].detail,
        address: [arr[aId].province, arr[aId].city, arr[aId].county],
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
    //console.log('picker发送选择改变，携带值为', e.detail.value)
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
    var adresList = wx.getStorageSync("address")
    var arr = [{
      aId: this.data.aId,
      name: this.data.name,
      phone: this.data.phone,
      province: this.data.address[0],
      city: this.data.address[1],
      county: this.data.address[2],
      detail: this.data.detailAddress,
      defalut: defaul
    }]
    if (this.data.msg == "addAddress") {
      if (adresList.length == 0) {
        wx.setStorageSync("address", arr)
      } else {
        if (this.data.defalut == true) {
          var arr1 = arr.concat(adresList)
        } else {
          var arr1 = adresList.concat(arr)
        }
        wx.setStorageSync("address", arr1)
      }
    } else if (this.data.msg == "editor") {
      if (this.data.defalut == true) {
        for (let i = 0; i < adresList.length; ++i) {
          if (adresList[i].aId == this.data.aId) {
            adresList.splice(i, 1);
            break;
          }
        }
        var arr1 = arr.concat(adresList)
      } else {
        for (let i = 0; i < adresList.length; ++i) {
          if (adresList[i].aId == this.data.aId) {
            adresList[i] = arr[0]
            break;
          }
        }
        var arr1 = adresList
      }
      wx.setStorageSync("address", arr1)
    }
    this.saveOld(arr);
    this.checkAddressDefalut()
    wx.setStorageSync("fakeAid", this.data.aId - 1)
    wx.setStorageSync("addressFlag", true)
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
    var adresList = wx.getStorageSync("address")
    if (adresList.length != 0) {
      var arr = wx.getStorageSync("delAddress")
      for (let i = 0; i < adresList.length; ++i) {
        if (adresList[i].aId == this.data.aId && this.data.aId >= 0) {
          arr.push(adresList[i])
        }
        if (adresList[i].aId == this.data.aId) {
          adresList.splice(i, 1);
          break;
        }
      }
      wx.setStorageSync("delAddressFlag", true)
      wx.setStorageSync("delAddress", arr)
      arr = wx.getStorageSync("insAddress")
      for (let i = 0; i < arr.length; ++i) {
        if (arr[i].aId == this.data.aId) {
          arr.splice(i, 1);
        }
      }
      wx.setStorageSync("insAddress", arr)
      arr = wx.getStorageSync("uptAddress")
      for (let i = 0; i < arr.length; ++i) {
        if (arr[i].aId == this.data.aId) {
          arr.splice(i, 1);
        }
      }
      wx.setStorageSync("uptAddress", arr)
    } else {
      adresList = []
    }
    wx.setStorageSync("address", adresList)
    wx.setStorageSync("addressFlag", true)
    wx.navigateBack({
      url: "../address/address"
    })
  },
  //保存修改后的信息
  saveOld: function(arr) {
    if (this.data.defalut==true){
      var arr1=wx.getStorageSync("insAddress")
      for(let i=0;i<arr1.length;++i){
        if (this.data.aId == arr1[i].aId){
          arr1[i].aId=0;
          break;
        }
      }
      wx.setStorageSync("insAddress", arr1)
      var arr1 = wx.getStorageSync("uptAddress")
      for (let i = 0; i<arr1.length; ++i) {
        if (this.data.aId == arr1[i].aId) {
          arr1[i].aId = 0;
          break;
        }
      }
    }
    if (wx.getStorageSync("addAddressFlag") == true) {
      wx.setStorageSync("insAddressFlag", true);
      arr = arr.concat(wx.getStorageSync("insAddress"))
      wx.setStorageSync("insAddress", arr)
    }

    if (wx.getStorageSync("editorFlag")) {
      if (this.data.aId >= 0) {
        wx.setStorageSync("uptAddressFlag", true);
        arr = arr.concat(wx.getStorageSync("uptAddress"))
        wx.setStorageSync("uptAddress", arr)
      }
    }

    arr=wx.getStorageSync("address")
    for (let i = 0; i < arr.length;++i){
      if(this.data.aId!=arr[i].aId){
        arr[i].defalut=0;
      }
    }
    wx.setStorageSync("address", arr)
  },
  onUnload: function() {
    wx.removeStorageSync("addAddressFlag")
    wx.removeStorageSync("editorFlag")
  },
  checkAddressDefalut: function() {
    if (this.data.defalut == true) {
      if (wx.getStorageSync("uptAddress").length != 0) {
        var arr = wx.getStorageSync("uptAddress");
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].aId == this.data.aId) {
            continue;
          }
          arr[i].defalut = 0;
        }
        wx.setStorageSync("uptAddress", arr)
      }
      if (wx.getStorageSync("insAddress").length != 0) {
        var arr = wx.getStorageSync("insAddress");
        if (wx.getStorageSync("addAddressFlag") == true) {
          arr[0].defalut = 1;
          for (let i = 1; i < arr.length; i++) {
            arr[i].defalut = 0;
          }
        } else {
          for (let i = 0; i < arr.length; i++) {
            arr[i].defalut = 0;
          }
        }
        wx.setStorageSync("insAddress", arr);
      }
    }
  }
})