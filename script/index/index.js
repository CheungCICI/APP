var setval;
    apiready = function() {
        requestPost('Goods/GoodsAll', {}, function(result, data) {
          if(result){
            var html = template('info', {
                'list': data
            });
            document.getElementById('goods_list').innerHTML = html;
            setval=setInterval("realprice()", 2000);
            $("#kong").click(function(){
                alert("功能尚未开放！");
                openfrm('../../index');
            });
           }else{
             console.log(data);
           }
        })

    }

    function realprice() {
        requestPost('Goods/GoodsAll', {}, function(result, data) {
        if(result){
            $.each(data, function(index, row) {
                if (row.real_price - parseFloat($(".price"+row.goods_id).text()) > 0) {
                    $(".price"+row.goods_id).css({"background-color":"red","color":"#fff","border-radius":"5px"});
                    $(".low"+row.goods_id).css({"color":"red"})
                    $(".top"+row.goods_id).css({"color":"red"})
                } else {
                    $(".price"+row.goods_id).css({"background-color":"green","color":"#fff","border-radius":"5px"});
                    $(".low"+row.goods_id).css({"color":"green"})
                    $(".top"+row.goods_id).css({"color":"green"})
                }
                $(".price"+row.goods_id).text(row.real_price);
            });
          }else{
            console.log(data);
          }
        })
    }
    function goodsdataile(goods_id){
      clearInterval(setval);
      var winName = api.frameName;
      setTimeout(function() {
          api.closeFrame({
              name: winName
          });
      }, 500);
       openfrm('../../html/index/goods','','',{'id':goods_id});
    }
