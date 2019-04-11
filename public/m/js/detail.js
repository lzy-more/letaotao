$(function() {
  var id = getQueryString("id");
  productDetail();
  //区域滚动
  function scroll() {
    mui(".mui-scroll-wrapper").scroll({
      deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    });
  }
  //轮播图
  function lunBoTu() {
    var gallery = mui(".mui-slider");
    gallery.slider({
      interval: 1000 //自动轮播周期，若为0则不自动播放，默认为0；
    });
  }
  function productDetail() {
    // console.log(id);
    $.ajax({
      url: "/product/queryProductDetail",
      data: { id: id },
      success: function(obj) {
        console.log(obj);

        //  console.log(size);
        var min = +obj.size.split("-")[0];
        var max = +obj.size.split("-")[1];
        obj.size = [];
        for (var i = min; i <= max; i++) {
          obj.size.push(i);
        }

        console.log(obj);
        var html = template("tpl", obj);
        $("#main").html(html);
        scroll();
        mui(".mui-numbox").numbox();
        lunBoTu();
        $("#main").on("tap", ".btn-size", function() {
          $(this)
            .addClass("mui-btn-warning")
            .siblings()
            .removeClass("mui-btn-warning");
        });
        $(".btn-buy").on("tap", function() {
          // console.log(11111111111111);

          var num = mui(".mui-numbox")
            .numbox()
            .getValue();
          //   console.log(num);
          var size = $(".mui-btn-warning").data("size");
          //   console.log(size);
          $.ajax({
            url: "/cart/addCart",
            type: "post",
            data: { productId: id, num: num, size: size },
            success: function(obj) {
              // console.log(obj);
              if (obj.error) {
                location = " Login.html?returnUrl=" + location.href;
              } else {
                if ($(".btn-size").hasClass("mui-btn-warning")) {
                  mui.confirm(
                    "您真的要去购物车查看吗？",
                    "温馨提示",
                    ["确定", "取消"],
                    function(e) {
                      // 回调函数当点击了确定 或者 取消就会触发函数
                      if (e.index == 0) {
                        // 8. 表示点击了左边按钮 跳转到购物车页面
                        location = "cart.html";
                      } else {
                        // 9. 表示点击了右边的按钮 提示用户继续添加
                        mui.toast("请继续添加!", {
                          duration: 1000,
                          type: "div"
                        });
                      }
                    }
                  );
                } else {
                  alert("请勾选尺码");
                }
              }
            }
          });
        });
      }
    });
  }
  function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
      return decodeURI(r[2]);
    }
    return null;
  }
});
