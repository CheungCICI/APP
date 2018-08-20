var serviceUrl = "http://ls.guaixiaopang.com/index.php/";
var pictureUrl = "http://ls.guaixiaopang.com//";
function openfrm(name, head_id, foot_id, parameter, status, bounces, edit_status) {
    if (!status) status = false;
    if (!bounces) bounces = false;
    if (edit_status) {
        edit_status = false;
    } else {
        edit_status = true;
    }
    var name_1 = name.substr(name.lastIndexOf('/', name.lastIndexOf('/') - 1) + 1);
    if (!(typeof parameter == 'object')) parameter = eval('(' + parameter + ')');
    var height = 0;
    if (head_id && head_id != '') {
        height = $api.offset($api.byId(head_id)).h;
    }
    var footer_h = 0;
    if (foot_id && foot_id != '') {
        footer_h = $api.offset($api.byId(foot_id)).h;
    }
    api.openFrame({
        name: name_1,
        url: name + '.html',
        pageParam: parameter,
        vScrollBarEnabled: false,
        hScrollBarEnabled: false,
        reload: true,
        bounces: bounces,
        bgColor: '#fff',
        scrollEnabled: true,
        rect: {
            x: 0,
            y: height,
            w: 'auto',
            h: 'auto',
            marginBottom: footer_h,
        },
        animation: {
            type: "none", //动画类型（详见动画类型常量）
            duration: 300 //动画过渡时间，默认300毫秒
        },
        allowEdit: edit_status
    })
}
//执行打开win
function openWin(name, parameter, status, edit_status) {
    api.setStatusBarStyle({
        style: 'dark'
    });
    if (!status) status = false;
    if (edit_status) {
        edit_status = false;
    } else {
        edit_status = true;
    }
    var name_1 = name.substr(name.lastIndexOf('/', name.lastIndexOf('/') - 1) + 1);
    if (name_1 == '../talk_win') name_1 = 'root';
    var delay = 0;
    if (!(typeof parameter == 'object')) parameter = eval('(' + parameter + ')');
    var ani_type = 'none';
    var ani_time = 0;
    var direct = 'from_right';
    if (name_1 == 'root' || name_1 == 'store/shopping_win' || name_1 == 'index/index_win' || name_1 == 'store/cart_win' ||
        name_1 == 'school/school_info_win' || name_1 == 'person/index_win' || name_1 == 'index/person_win') {
        ani_type = 'none';
        ani_time = 0;
    }
    api.openWin({
        name: name_1,
        url: name + '.html',
        pageParam: parameter,
        bounces: false,
        delay: delay,
        reload: status,
        slidBackEnabled: false,
        vScrollBarEnabled: false,
        animation: {
            type: ani_type, //动画类型（详见动画类型常量）
            subType: direct,
            duration: ani_time //动画过渡时间，默认300毫秒
        },
        allowEdit: edit_status
    });
}
function closeWin() {
    api.closeWin({
        animation: {
            type: "none", //动画类型（详见动画类型常量）
            subType: "from_left", //动画子类型（详见动画子类型常量）
            duration: 0 //动画过渡时间，默认300毫秒
        }
    });
}

function requestPost(action, parameters, callback) {
    parameters.user_id = $api.getStorage('user_id');
    parameters.session = $api.getStorage('user_session');
    // console.log(JSON.stringify(parameters));
    api.ajax({
        url: serviceUrl + action,
        method: 'post',
        data: {
            values: parameters
        }
    }, function(data) {
        //console.log(JSON.stringify(data));
        var response = data;
        if (response.result == 'failed') {
            callback(false, response.data);
        } else if (response.result === 'auth') {
            //console.log(response.data);
            //alert('你已退出请登陆，请重新登陆');
            // window.location = 'login.php';

            $api.setStorage('authboolean', true);
            var winName = api.winName;
            //console.log(winName)
            setTimeout(function() {
                api.closeWin({
                    name: winName
                });
            }, 500);
            openWin('widget://html/login/login', {}, true);

            return;
        } else if (response.result === 'succ') {
            //console.log(response.data);
            callback(true, response.data);
        } else {
            callback(false, '系统未知错误，请稍后重试');
        }
    });
}
function in_array(search,array){
    for(var i in array){
        if(array[i]==search){
            return true;
        }
    }
    return false;
}



function getDistance(lon, lat,callback) {
    var aMap = api.require('aMap');
    var startlon=$api.getStorage('singleLocation').lon;
    var startlat=$api.getStorage('singleLocation').lat;
    aMap.getDistance({
        start: {
            lon: startlon,
            lat:startlat
        },
        end: {
            lon: lon,
            lat: lat
        }
    }, function(ret, err) {
        if (ret.status) {
            //console.log(ret.distance);
          callback(Math.floor(ret.distance/10) / 100  );
        } else {
          //  alert(JSON.stringify(err));
          callback(0);
        }
    });
}

function authUser(action, parameters, callback) {
    api.ajax({
        url: serviceUrl + action,
        method: 'post',
        data: {
            values: parameters
        }
    }, function(data) {
        //console.log(JSON.stringify(data));
        var response = data;
        if (response.result == 'failed') {
            callback(false, response.data);
        } else if (response.result === 'succ') {
            //console.log(response.data);
            callback(true, response.data);
        }
    });
}
//读文件
function readFile(path, callBack) {
    var cacheDir = api.cacheDir;
    api.readFile({
        path: cacheDir + path
    }, function(ret, err) {
        callBack(ret, err);
    });
}
//写文件
function writeFile(json, id, path) {
    //缓存目录
    var cacheDir = api.cacheDir;
    api.writeFile({
        //保存路径
        path: cacheDir + '/' + path + '/' + id + '.json',
        //保存数据，记得转换格式
        data: JSON.stringify(json)
    }, function(ret, err) {

    })
}
//缓存方法
function doCache(folder, id, action, parameters, callback) {
    readFile('/' + folder + '/' + id + '.json', function(ret, err) {
        if (ret.status) {
            //如果成功，说明有本地存储，读取时转换下数据格式
            //拼装json代码
            //alert('取到缓存')
            var cacheData = ret.data;
            // callback(JSON.parse(cacheData));
            //再远程取一下数据，防止有更新
            requestPost(action, parameters, function(result, data) {
                if (result) {
                    if (cacheData != JSON.stringify(data)) {
                        //有更新处理返回数据
                        // alert('更新缓存')
                        callback(data);
                        //缓存数据
                        writeFile(data, id, folder);
                        iCache($('.cache'));
                    } else {
                        callback(JSON.parse(cacheData));
                        iCache($('.cache'));
                    }
                } else {
                    alert('数据获取失败！');
                }
            })

        } else {
            //如果失败则从服务器读取，利用上面的那个ajaxRequest方法从服务器GET数据
            requestPost(action, parameters, function(result, data) {
                if (result) {
                    //处理返回数据
                    //alert('没取到缓存')
                    callback(data);
                    //缓存数据
                    writeFile(data, id, folder);
                    iCache($('.cache'));
                } else {
                    alert('数据获取失败！');
                }
            })
        }
    })
}
//缓存图片
function iCache(selector) {
    selector.each(function(data) {
        ! function(data) {
            var url = selector.eq(data).attr("src");
            var img = this;
            var pos = url.lastIndexOf("/");
            var filename = url.substring(pos + 1);
            var path = api.cacheDir + "/pic/" + filename;
            var obj = api.require('fs');
            obj.exist({
                path: path
            }, function(ret, err) {
                //msg(ret);
                if (ret.exist) {
                    if (ret.directory) {
                        //api.alert({msg:'该路径指向一个文件夹'});
                    } else {
                        //api.alert({msg:'该路径指向一个文件'});
                        //selector.eq(data).src=path;
                        selector.eq(data).attr('src', null);
                        path = api.cacheDir + "/pic/" + filename;
                        selector.eq(data).attr('src', path);
                        //console.log(selector.eq(data).attr("src"));
                    }
                } else {
                    api.download({
                        url: url,
                        savePath: path,
                        report: false,
                        cache: true,
                        allowResume: true
                    }, function(ret, err) {
                        //msg(ret);
                        if (ret) {
                            var value = ('文件大小：' + ret.fileSize + '；下载进度：' + ret.percent + '；下载状态' + ret.state + '存储路径: ' + ret.savePath);
                        } else {
                            var value = err.msg;
                        };
                    });
                }
            });
        }(data);
    });
};

function hide_page() {
    $('#loading_page').remove();
    $('#loading_page_2').remove();
    $('body').css('overflow-y', 'auto');
    $('body').css('position', 'static');
    $('body').css('height', 'auto');
}
//提示消息方法
function showMsg(type, data, call) {
    switch (type) {
        case "success":
            api.toast({
                msg: data,
                duration: 2000,
                location: 'bottom'
            }, call);
            break;
        case "fail":
            api.toast({
                msg: data,
                duration: 2000,
                location: 'bottom'
            }, call);
            break;
        case "loading":
            api.showProgress({
                title: '努力加载中...',
                text: '先喝杯茶...',
                modal: false
            });
            break;
        case "zdy":
            api.toast({
                msg: data,
                duration: 2000,
                location: 'bottom'
            }, call);
            break;
        case "zdy1":
            api.toast({
                msg: data,
                duration: 2000,
                location: 'bottom'
            }, call);
            break;
        default:
            break;
    }
}
//验证手机
function CheckPhone(phone) {
    if (!(/^1[34578]\d{9}$/.test(phone))) {
        return false;
    } else {
        return true;
    }
}

//验证密码
function CheckPwd(pwd) {
    if (!(/^[a-zA-Z]\w{5,17}$/.test(pwd))) {
        return false;
    } else {
        return true;
    }
}
//两次退出
var first = null;

function toLauncher() {
    api.addEventListener({
        name: 'keyback'
    }, function(ret, err) {
        if (!first) {
            first = new Date().getTime();
            api.toast({
                msg: '再按一次退出',
                duration: 1500,
                location: 'bottom'
            });
            setTimeout(function() {
                first = null;
            }, 1000);
        } else {
            if (new Date().getTime() - first < 1000) {
                api.closeWidget({
                    silent: true
                });
            }
        }
    });
}
