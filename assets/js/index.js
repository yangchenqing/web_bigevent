$(function() {

    var layer = layui.layer
        // 点击按钮，实现退出功能
    $('#btnLogout').on('click', function() {
            // 提示用户是否确认退出
            layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function(index) {
                //do something
                // 1. 清空本地存储中的 token
                localStorage.removeItem('token')
                    // 2. 重新跳转到登录页面
                location.href = '/login.html'

                // 关闭 confirm 询问框
                layer.close(index)
            })
        })
        // 控制访问权限
        // complete: function(res) {
        //     if (res.responseJSON.status === 1 && res.responseJSON.message == '身份认证失败！') {
        //         // 强制清除token
        //         localStorage.removeItem('token')
        //             // 强制跳转到登录页面
        //         localStorage.href = '/login.html'
        //     }

    // }
    getUserInfo()

    function getUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            headers: {
                Authorization: localStorage.getItem('token') || '',
            },
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败')
                }
                // 调用renderAvater渲染用户的头像
                renderAvatar(res.data)
            }
        })
    }
    //渲染用户头像
    function renderAvatar(user) {
        var name = user.nickname || user.username
        $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
        if (user.user_pic !== null) {
            $('.layui-nav-img').attr('scr', 'user_pic').show()
            $('.text-avatar').hide()
        } else {
            $('.layui-nav-img').hide()
            var frist = name[0].toUpperCase()
            $('.text-avatar').html(frist).show
        }
    }
})