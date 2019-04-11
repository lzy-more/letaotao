$(function () {

  yanMa()
  userRegister()

  //发送注册接口信息
  function userRegister() {

    yanMa()

    // console.log(vCode);
    $('.btn-register').on('tap', function () {
      var mobile = $(".mobile").val().trim();
      var username = $(".username").val().trim();
      var password = $(".password").val().trim();
      var rePassword = $(".rePassword").val().trim();
      var vCode1 = $(".vCode").val().trim();
      // 2. 开关思想 默认check为true表示验证通过
      var check = true;
      mui(".mui-input-group input").each(function () {
        //若当前input为空，则alert提醒 
        if (!this.value || this.value.trim() == "") {
          var label = this.previousElementSibling;
          mui.alert(label.innerText + "不允许为空");
          // 如果进入这个函数表示验证没有通过 把check改成false
          check = false;
          // return只能return当前函数
          return false;
          // console.log('当前函数里面后面代码不执行');
        }
      });
      if (check) {
        // 4.1 判断手机号是否合法 调用这个函数 传入手机号 返回true或者false 返回false表示不合法 !false == true
        if (!isPoneAvailable(mobile)) {
          mui.toast('手机号输入不合法', {
            duration: 'long',
            type: 'div'
          });
          // 不合法后面代码不执行
          return;
        }
          // 4.3 判断两次输入密码是否一致
          if (password != rePassword) {
            mui.toast('两次输入的密码不一致', {
                duration: 'long',
                type: 'div'
            });
            return;
        }
        $.ajax({
          url:'/user/register',
          type: 'post',
          data: {
            username: username,
            password: password,
            mobile: mobile,
            vCode: vCode1
        },
        success:function  (data){
        // console.log(data);
        if(data.success){
          location = 'index.html?returnUrl=user.html';
        }else{
          mui.toast(data.message, {
            duration: 'long',
            type: 'div'
        });
        }
      
        
        }
        })
      }
    })
  }

  function yanMa() {
    //验证码接口
    $(".btn-getMa").on("tap", function () {
      var num = 5;

      var timeID = setInterval(function () {
        num--;
        $(".btn-getMa")
          .html(num + "s")
          .css({
            "background-color": "#ccc"
          });
        if (num == 0) {
          $(".btn-getMa")
            .html("5s")
            .css({
              "background-color": "blue"
            });
          clearInterval(timeID);
          $.ajax({
            url: "/user/vCode",
            success: function (obj) {
              var vCode = $(".vCode").val(obj.vCode);
              //    vCode = $(".vCode").val();
              //    console.log(vCode);

            }
          });
        }
      }, 1000);
    });
  }
  // 判断手机号是否合法
  function isPoneAvailable(mobile) {
    var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
    if (!myreg.test(mobile)) {
      return false;
    } else {
      return true;
    }
  }
});