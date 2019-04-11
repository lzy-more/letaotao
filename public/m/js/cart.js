$(function () {
  queryCart();
  //   scroll ()

  upLOadOrPull();
  deleteCart()
  editorCart()
  // getSum ()
  function queryCart() {
    $.ajax({
      url: "/cart/queryCartPaging",
      data: {
        page: 1,
        pageSize: 4
      },
      success: function (obj) {
        console.log(obj);
        var html = template("tpl", obj);
        $("#main .mui-table-view").html(html);
        getSum()
        $('.mui-table-view').on('change', '.mui-checkbox input', function () {
          // console.log(111111)
          getSum()

        })
      }
    });
  }

  function scroll() {
    mui(".mui-scroll-wrapper").scroll({
      deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    });
  }

  function upLOadOrPull() {
    mui.init({
      pullRefresh: {
        container: "#pullrefresh",
        down: {
          callback: pulldownRefresh
        },
        up: {
          contentrefresh: "正在加载...",
          callback: pullupRefresh
        }
      }
    });
    /**
     * 下拉刷新具体业务实现
     */
    function pulldownRefresh(params) {
      setTimeout(function () {
        //  1. 发送请求请求购物车列表数据
        $.ajax({
          // 下拉刷新请求第一页数据 需要请求带分页的这个接口
          url: "/cart/queryCartPaging",
          // 一定要传入分页page和pageSize
          data: {
            page: 1,
            pageSize: 5
          },
          success: function (list) {
            //   console.log(list);
            if (list.error) {
              location = "Login.html?returnUrl=" + location.href;
            } else {
              //  2. 请求带分页的接口返回数据不是数组是一个对象不需要包装
              var html = template("tpl", list);
              // 3. 把模板渲染到ul里面
              $("#pullrefresh .mui-table-view").html(html);
              // 4. 结束下拉刷新 不结束会会一直转圈圈
              mui("#pullrefresh")
                .pullRefresh()
                .endPulldownToRefresh(); //refresh completed
              // 5. 下拉刷新完成后要重置上拉加载的效果 (注意一定要等结束转圈圈再重置)
              mui("#pullrefresh")
                .pullRefresh()
                .refresh(true);
              // 6. 数据也要重置为第一页开始
              page = 1;
            }
          }
        });
      }, 1500);
    }
    var page = 1;
    /**
     * 上拉加载具体业务实现
     */
    function pullupRefresh() {
      setTimeout(function () {
        //  1. 每次上拉加载下一页page++
        page++;
        //  1. 发送请求请求购物车列表数据
        $.ajax({
          // 下拉刷新请求第一页数据 需要请求带分页的这个接口
          url: "/cart/queryCartPaging",
          // 一定要传入分页page和pageSize
          data: {
            page: page,
            pageSize: 4
          },
          success: function (res) {
            // 返回的一个数组空数组 res == []  [].data 已经undefined 所以直接判断有没有data属性 有表示有数据 没有表示没有数据
            if (res.data) {
              // 2. 请求带分页的接口返回数据不是数组是一个对象不需要包装
              var html = template("tpl", res);
              // 3. 把模板渲染到ul里面 上拉加载要追加数据 使用append
              $("#pullrefresh .mui-table-view").append(html);
              // 4. 结束上拉加载 不结束会会一直转圈圈
              mui("#pullrefresh")
                .pullRefresh()
                .endPullupToRefresh(); //refresh completed
            } else {
              // 5. 没有数据的时候提示没有数据了
              mui("#pullrefresh")
                .pullRefresh()
                .endPullupToRefresh(true); //refresh completed
            }
          }
        });
      }, 1500);
    }
  }
  //删除购物车
  function deleteCart() {
    $('#main .mui-table-view').on('tap', '.btn-delete', function () {
      // console.log(this);
      var id = $(this).data('id')
      // console.log(id);

      //第一个demo，拖拽后显示操作图标，点击操作图标删除元素；
      $('.mui-table-view').on('tap', '.mui-btn', function (event) {
        var elem = this;
        var li = elem.parentNode.parentNode;
        mui.confirm('确认删除该条记录？', '温馨提示', ['确认', '取消'], function (e) {
          if (e.index == 0) {
            $.ajax({
              url: '/cart/deleteCart',
              data: {
                id: id
              },
              success: function (obj) {
                console.log(obj);
                if (obj.success) {
                  li.parentNode.removeChild(li);
                } else {
                  mui.toast('删除失败', {
                    duration: 'long',
                    type: 'div'
                  })
                }

              }
            })

          } else {
            setTimeout(function () {
              mui.swipeoutClose(li);
            }, 500);
          }
        });
      });


    })
  }
  //编辑购物车

  function editorCart() {
    $('#main .mui-table-view').on('tap', '.btn-editor', function (e) {
      // console.log(this);
      var product = $(this).data('product')
      // console.log(product);
      var id = product.id;
      var num = product.num;
      var min = +product.productSize.split("-")[0];
      var max = +product.productSize.split("-")[1];
      // var productSize= productSize.size;

      product.productSize = [];

      for (var i = min; i <= max; i++) {
        product.productSize.push(i);
      }
      // console.log( product.productSize);

      //第一个demo，拖拽后显示操作图标，点击操作图标删除元素；
      // $('.mui-table-view').on('tap', '.mui-btn', function(event) {
      var elem = this;
      var li = elem.parentNode.parentNode;
      var html = template('editorTpl', product)
      html = html.replace(/[\r\n]/g, '');
      // console.log(html);

      mui.confirm(html, '编辑', ['确认', '取消'], function (e) {
        // console.log(e)
        if (e.index == 0) {
          var size = $('.btn-size.mui-btn-warning').data('size');

          var num = mui('.mui-numbox').numbox().getValue();
          $.ajax({
            url: '/cart/updateCart',
            type: 'post',
            // data里面所有数据 里面包含了id
            data: {
              id: product.id,
              size: size,
              num: num
            },
            success: function (data) {
              //   7. 判断如果编辑成功调用查询刷新页面
              //  console.log(data);
              queryCart()

            }
          })


        } else {
          setTimeout(function () {
            mui.swipeoutClose(li);
          }, 500);
        }
        // });
      });
      mui('.mui-numbox').numbox();
      // 4.1 让尺码能够点击也是在渲染完成后加事件和添加类名等 这个时候已经出来了不需要委托
      $('.btn-size').on('tap', function () {
        $(this).addClass('mui-btn-warning').siblings().removeClass('mui-btn-warning');
      });

    })
  }
  //计算总金额
  function getSum() {
    // 1. 获取所有选中的复选框

    var checkeds = $('.mui-checkbox input:checked');
    //  console.log(checkeds);

    var sum = 0;
    checkeds.each(function (index, value) {
      // console.log(value);
      var num = $(value).data('num');
      //  console.log(num);
      var price = $(value).data('price')
      // console.log(price);

      var count = parseInt(num * price);
      // console.log(count);

      sum += count;
      $('.cardOrderTOtal').html("$" + sum)




    })
  }
});