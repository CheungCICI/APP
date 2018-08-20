var setinv;
apiready = function() {
  var nowstate =api.pageParam.nowstate?api.pageParam.nowstate:'';

  if(nowstate==1){
    $.each($('.tab-nav-item'), function() {
      var html=$(this).find('a').html();
      if(html=='持仓明细'){
        $(this).addClass('tab-active');
        $(this).siblings().removeClass('tab-active');
        $('#options').addClass('tab-active');
        $('#history').removeClass('tab-active');
      }
    })
  }
  //下拉刷新
  api.setRefreshHeaderInfo({
      visible: true,
      loadingImg:'',
      bgColor: '#f5f5f5',
      textColor: '#ccc',
      textDown: '下拉加载更多',
      textUp:'松开加载',
      textLoading:'加载中...',
      showTime: false
  }, function(ret, err) {
    MyPosition();
   OrderHistory();
     setTimeout(function(){
       api.refreshHeaderLoadDone();
     },500)
  });
  MyPosition();
  OrderHistory();
}
function OrderHistory(){
  layui.use('flow', function() {
      var $ = layui.jquery; //不用额外加载jQuery，flow模块本身是有依赖jQuery的，直接用即可。
      var flow = layui.flow;
      flow.load({
          elem: '#history' //指定列表容器
              ,
          done: function(page, next) { //到达临界点（默认滚动触发），触发下一页
              requestPost('Order/OrderHistory', {
                  'page': page
              }, function(result, data) {
                  var list = template('historyhtml', {
                      'list': data.history
                  });
                  next(document.getElementById('history').insertAfter = list, page < data.count);
              });
          }
      });
  });

}
function MyPosition(){
  requestPost('Order/MyPosition', {}, function(result, data) {
      if (result) {
          var html = template('optionshtml', {
              'list': data
          });
          $('#options').html(html);
    setinv=  setInterval("real_price()", 1000);
      } else {
          showMsg('fail',data);
      }
  });
}






function real_price(){
  if(!$('.options').length){
      clearInterval(setinv);
  }
  $.each($('.options'), function() {
      var present_price = $(this).find('.present_price').html();
      var newprice = $(this).find('.newprice').html();
      var order_id = $(this).find('.order_id').html();
    optinsitem($(this),order_id);
  })
}
function optinsitem(pos,order_id){
  requestPost('Order/MyPositionGroupbyId', {
      'order_id': order_id
  }, function(result, data) {
      if (result) {

          var nowstate = data.nowstate;
          if(nowstate==1){
            $(pos).remove();
          }
          var highs_lows = data.highs_lows;
          var present_price = data.present_price;
          var real_price = data.real_price;
          var countdown=parseInt(data.countdown);
          pos.find('.countdown').html(real_price);
          pos.find('.downtime').html(timego(countdown));
        var amount=data.amount;
        var odds=data.odds;
          if((highs_lows==0 &&(real_price<present_price))||(highs_lows==1 &&(real_price>present_price))){
            pos.find('.newprice').html((parseInt(amount)*(1+parseFloat(odds))).toFixed(2));
            pos.find('.optionsitem-list ').addClass('item-list-red');
            pos.find('.optionsitem-list ').siblings().removeClass('item-list-gr');
          }else{
            pos.find('.newprice').html(-parseInt(amount)+".00");
            pos.find('.optionsitem-list ').addClass('item-list-gr');
            pos.find('.optionsitem-list ').siblings().removeClass('item-list-red');
          }
      } else {
        //  YDUdialog.alert(data)
      }
  });
  function timego(ttime){
    var minute = parseInt(ttime/60%60);
    var seconds = parseInt(ttime%60);
    if(minute<10){
        minute = "0" + minute;
    }
    if(seconds<10){
        seconds = "0" + seconds;
    }
    var time = minute+":"+seconds;
    return time;
  }
}
