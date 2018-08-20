function payOrder(type) {
    var payType = $("input[name='radio']:checked").val();

    requestPost('Pay/OrderPay', {
        'order_id': order_id,
        'pf': type,
        'payType': payType
    }, function(result, data) {
        if (result) {
            if (payType == 0) {
                alipay(data);
            } else if (payType == 1) {
                wxpay(data);
            } else if (payType == 3) {
                investpay(data);
            } else if (payType == 2) {
                openWin('../../html/person/my_order_win', {}, true);
            }
        } else {
            showMsg('fail', data);
            //api.closeWin();
        }
    });

}

function alipay(data) {
    var aliPayPlus = api.require('aliPayPlus');
    aliPayPlus.payOrder({
        orderInfo: data
    }, function(ret, err) {
        if (ret.status) {
            api.alert({
                title: '支付提示',
                msg: '支付成功',
            }, function(ret, err) {
                openWin('../../html/person/my_order_win', {}, true);
                setTimeout(function() {
                    api.closeWin();
                }, 1500);
            });
        } else {
            if (ret.code == 6001) {
                showMsg('success', '取消支付');
            } else if (ret.code == 4000) {
                showMsg('success', '支付失败');
            } else if (ret.code == 6002) {
                showMsg('success', '网络连接出错');
            }
        }
    });
}

function wxpay(back_info) {
    var wxPay = api.require('wxPay');
    console.log(JSON.stringify(back_info));
    wxPay.payOrder({
        apiKey: back_info.appid,
        orderId: back_info.prepayid,
        mchId: back_info.partnerid,
        nonceStr: back_info.noncestr,
        timeStamp: back_info.timestamp,
        package: back_info.package,
        sign: back_info.sign
    }, function(rets, err) {
        if (rets.status) {
            api.alert({
                title: '支付提示',
                msg: '支付成功',
            }, function(ret, err) {
                openWin('../../html/person/my_order_win', {}, true);
                setTimeout(function() {
                    api.closeWin();
                }, 1500);
            });
        } else {

            if (err.code == -2) {
                showMsg('success', '取消支付');
            } else {
                showMsg('success', '支付失败444444444444444444444' + err.code);
            }
        }
    });
}

function investpay(data) {
  var winName = api.winName;
  //console.log(winName)
  setTimeout(function() {
      api.closeWin({
          name: winName
      });
  }, 500);
    openWin('../../html/shop/investpay_win',{'jsonRequestData':JSON.stringify(data)},true);
}
