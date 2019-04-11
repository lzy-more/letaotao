$(function  (){
    chaXun ()
function chaXun (){
$.ajax({
    url:'/user/queryUserMessage',
    success:function  (obj){
    console.log(obj);
    var name=obj.username
    var phoneNum=obj.mobile
    $('.name').html(name)
    $('.phoneNum').html(phoneNum)
    
    }

})
$('.logOutBtn').on('tap',function  (){
// location='register.html'
$.ajax({
    url:'/user/logout',
    success:function  (obj){
    console.log(obj);
    if(obj.success){
        location = 'Login.html?returnUrl=' + location.href;
    }
    
    }
})

})
}
})