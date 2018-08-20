apiready=function(){
api.setStatusBarStyle({
    style: 'dark'
  });
  toLauncher();
  openfrm('./html/index/index_frm','','footer');
  api.addEventListener({
      name: 'SetChatMsgDot'
  }, function(ret, err) {
    var color=ret.value.color;
    $('.chat_dot').css('background',color);
  });
};

var originalHeight=document.documentElement.clientHeight || document.body.clientHeight;
// console.info("原始窗口的高度"+originalHeight);
window.onresize=function(){
//软键盘弹起与隐藏  都会引起窗口的高度发生变化
var resizeHeight=document.documentElement.clientHeight || document.body.clientHeight;
//  console.info("软键盘弹起后窗口的高度"+resizeHeight);
 if(resizeHeight*1<originalHeight*1){
    api.setFrameAttr({
        name: 'index/index_frm',
        rect: {
            marginBottom: 0
        }

    });
 } else {
   api.setFrameAttr({
       name: 'index/index_frm',
       rect: {
           marginBottom:$api.offset($api.byId('footer')).h
       }
   });
 }
}