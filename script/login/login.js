apiready = function() {
    $('.login-submit').click(function() {
        var user_phone = $('.img1').val();
        var password = $('.img2').val();
        if (!user_phone) {
            showMsg('fail', '用户名不能为空');
            $('.img1').focus();
            return;
        }
        if (!password) {
            showMsg('fail', '密码不能为空');
            $('.img2').focus();
            return;
        }
        authUser('Index/login', {
            'uname': user_phone,
            'pword': password
        }, function(result, data) {
            if (result) {
                $api.setStorage('user_id', data.user_id);
                $api.setStorage('user_session', data.session);
                openWin('../../index');
            } else {
                showMsg('fail', data);
            }
        })
    });
    $("reg").click(function(){
      console.log("sss");
      openfrm('user_frm');
    })
}