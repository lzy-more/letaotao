$(function() {
  Login();
  register ()
  // 获取登录信息
  function Login() {
    $(".mui-btn-primary").on("tap", function() {
      var username = $(".mui-input-clear").val();
      var password = $(".mui-input-password").val();
      console.log(username);

      $.ajax({
        url: "/user/login",
        type: "post",
        data: { username: username, password: password },
        success: function(obj) {
          console.log(obj);
          if (obj.error) {
            alert("请注册谢谢");
            return;
          } else {
            var returnUrl = getQueryString("returnUrl");
            location = returnUrl;
          }
        }
      });
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
  //注册页面
  function register (){
  $('.btn-register').on('tap',function  (){
    location = " register.html?returnUrl=" + location.href;
  
  })
  }
});
