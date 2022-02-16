$(function() {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage
        // 定义一个查询的参数对象，将来请求数据的时候，
        // 需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }

    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(date) {
            const dt = new Date(date)
            var y = dt.getFullYear()
            var m = padZero(dt.getMonth() + 1)
            var d = padZero(dt.getDate())
            var hh = padZero(dt.getHours())
            var mm = padZero(dt.getMinutes())
            var ss = padZero(dt.getSeconds())
            return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
        }
        //定义补零的函数
    function padZero(n) {
        return n < 9 ? n : '0' + n
    }
    initTable()

    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                // console.log(res);
                //渲染模版引擎
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                renderPage(res.total)
            }
        })
    }
    initCate()

    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                }
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }
    $('#form-search').on('submit', function(e) {
            e.preventDefault()
                // 获取表单中选中项的值
            var cate_id = $('[name=cate_id]').val()
            var state = $('[name=state]').val()
                // 为查询参数对象 q 中对应的属性赋值
            q.cate_id = cate_id
            q.state = state
                // 根据最新的筛选条件，重新渲染表格的数据
            initTable()
        })
        // 动议渲染分页的renderPage()方法
    function renderPage(total) {
        // 调用 laypage.render() 方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox', // 分页容器的 Id
            count: total, // 总数据条数
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum, // 设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 分页发生切换的时候，触发 jump 回调
            jump: function(obj, first) {
                // console.log(obj.curr)
                // 把最新的页码值，赋值到 q 这个查询参数对象中
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                if (!first) {
                    initTable()
                }
            }
        })

    }
    $('tbody').on('click', '.btn-delete', function() {
        // 获取到文章的 id
        var id = $(this).attr('data-id')
            // 询问用户是否要删除数据
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')
                    initTable()
                }
            })

            layer.close(index)
        })
    })
})