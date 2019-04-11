window.addEventListener("load", function() {
  // slider();
  scroll();
  leftAjax();
  // rightAjax();
  firstId(1);
});

// 内容滚动
function scroll() {
  mui(".mui-scroll-wrapper").scroll({
    deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
  });
}
//左侧数据渲染
function leftAjax() {
  $.ajax({
    url: "/category/queryTopCategory",
    success: function(obj) {
      // console.log(obj);
      var html = template("tpl", { list: obj.rows });
      $(".mui-table-view").html(html);
      $(".mui-table-view li:first-child").addClass("active");
      var lis = $(".mui-table-view li");
      // console.log(lis);
      lis.on("click", function() {
        // console.log(this.dataset['id']);
        firstId(this.dataset["id"]);
        $(this)
          .addClass("active")
          .siblings("li")
          .removeClass("active");
      });
    }
  });
}
//右侧数据渲染
function firstId(id) {
  $.ajax({
    url: "/category/querySecondCategory",
    data: { id: id },
    success: function(obj) {
      // console.log(obj)
      var html = template("tp2", obj);
      $(".mui-scroll-wrapper .mui-row").html(html);
    }
  });
}
