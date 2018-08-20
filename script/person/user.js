apiready = function () {
    MyMessage();
    //下拉刷新
    api.setRefreshHeaderInfo({
        visible: true,
        loadingImg: '',
        bgColor: '#f5f5f5',
        textColor: '#ccc',
        textDown: '下拉加载更多',
        textUp: '松开加载',
        textLoading: '加载中...',
        showTime: false
    }, function (ret, err) {
        setTimeout(function () {
            api.refreshHeaderLoadDone();
        }, 500)
        MyMessage();
    });
    $('.power').click(function () {
        $api.rmStorage('user_id');
        $api.rmStorage('user_session');
        var winName = api.winName;
        openWin('widget://html/login/login', {}, true);
        setTimeout(function () {
            api.closeWin({
                name: winName
            });
        }, 500);
    });
    $('.bt_bank').click(function () {
        $api.rmStorage('user_id');
        $api.rmStorage('user_session');
        var winName = api.winName;
        openWin('widget://html/login/login', {}, true);
        setTimeout(function () {
            api.closeWin({
                name: winName
            });
        }, 500);
    });

}
function MyMessage() {
    requestPost('Personal/MyMessage', {}, function (result, data) {
        // console.log(JSON.parse(data));
        if (result) {
            $('.username').html(data['uname'] + '[' + data['user_true_name'] + ']');
            $('.money').html('￥'+data.money);
        } else {
            showMsg('fail', '未获取到有效数据，请重新登录');
            var winName = api.winName;
            //console.log(winName)
            setTimeout(function () {
                api.closeWin({
                    name: winName
                });
            }, 500);
            openWin('widget://html/login/login', {}, true);
        }
    });
}
