apiready=function(){
    var nowstate =api.pageParam.nowstate?api.pageParam.nowstate:'';
    openfrm('../../html/order/order_options_frame','','footer',{'nowstate':1});
    api.addEventListener({
        name: 'SetChatMsgDot'
    }, function(ret, err) {
      var color=ret.value.color;
      $('.chat_dot').css('background',color);
    });
    toLauncher();
};