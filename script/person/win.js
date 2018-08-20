apiready=function(){
    openfrm('user_frm','','footer');
    api.addEventListener({
        name: 'SetChatMsgDot'
    }, function(ret, err) {
      var color=ret.value.color;
      $('.chat_dot').css('background',color);
    });
    toLauncher();
};
