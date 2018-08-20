apiready = function() {
    tx();
    api.setRefreshHeaderInfo({
        visible: true,
        loadingImg: '',
        bgColor: '#f5f5f5',
        textColor: '#ccc',
        textDown: '下拉加载更多',
        textUp: '松开加载',
        textLoading: '加载中...',
        showTime: false
    }, function(ret, err) {
        tx();
        setTimeout(function() {
            api.refreshHeaderLoadDone();
        }, 500)
    });


}


function tx() {
    layui.use('flow', function() {
        var $ = layui.jquery; //不用额外加载jQuery，flow模块本身是有依赖jQuery的，直接用即可。
        var flow = layui.flow;
        flow.load({
            elem: '#container' //指定列表容器
                ,
            done: function(page, next) { //到达临界点（默认滚动触发），触发下一页
                requestPost('Personal/WidthdrawList', {
                    'page': page
                }, function(result, data) {
                    var list = template('txhtml', {
                        'list': data.history
                    });
                    next(document.getElementById('container').insertAfter = list, page < data.count);

                });


            }
        });
    });
}
