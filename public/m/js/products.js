$(function  (){
    var search;
    productList ()
    nowProductList ()
    orderBy ()
    scroll ()
    productDetail ()
function scroll (){
    mui.init({
        pullRefresh: {
            container: '#pullrefresh',
            down: {
                contentdown: "你正在下拉", //可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
                contentover: "可以松手了", //可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
                contentrefresh: "哥正在拼命刷新中...", //可选，正在刷新状态时，下拉刷新控件上显示的标题内容
                callback: pulldownRefresh
            },
            up: {
                contentdown: "你正在上拉", //可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
                contentover: "可以松手了", //可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
                contentrefresh: '正在加载...',
                callback: pullupRefresh
            }
        }
    });
    /**
     * 下拉刷新具体业务实现
     */
    function pulldownRefresh() {
     setTimeout(function  (){
        ajaxProduct({ 
            proName:search,
            page:1,
            pageSize:3})
            mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed
     },1000)
    }
    var page = 1;
    /**
     * 上拉加载具体业务实现
     */
    function pullupRefresh() {
      setTimeout(function  (){
      page++;
    $.ajax({
        url:'/product/queryProduct',
        data:{
            proName:search,
            page:page,
            pageSize:2
        },
        success:function(obj){
            if(obj.data.length>0){

           
            var html=template('tpl',{list:obj.data})
            $('.firstRow').append(html)
            mui('#pullrefresh').pullRefresh().endPullupToRefresh();
        }else{
            mui('#pullrefresh').pullRefresh().endPullupToRefresh(true)
        }
        }
    })
   
      },1000)
    }
   
}
//跳转页面搜索
function productList (){
   search=getQueryString('search')
    // console.log(search);
    $.ajax({
        url:'/product/queryProduct',
        data:{
            proName:search,
            page:1,
            pageSize:2
        },
        success:function(obj){
        // console.log(obj);
        var html=template('tpl',{list:obj.data})
        $('.firstRow').html(html)
        }
    })
    

}
//当前页面搜索
function nowProductList (){

$('.blueBtn').on('tap',function(){
    // console.log(11111111111111);
    
     search=$('#searchBar').val();
    // console.log(search);
    if(search==''){
        alert('请输入商品');
        return;
    }
    ajaxProduct({ 
        proName:search,
        page:1,
        pageSize:2})
   
})
}
//从URL中获取参数值
function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return decodeURI(r[2]);
    }
    return null;
}
//ajax请求
function  ajaxProduct(param){
    $.ajax({
        url:'/product/queryProduct',
        data:param,
        success:function(obj){
        // console.log(obj);
        var html=template('tpl',{list:obj.data})
        $('.firstRow').html(html)
        }
    })
}

//排序功能
function orderBy (){
    $('.mui-card .mui-card-header a').on('tap',function  (){
    // console.log(1111111);
      // 2. 获取当前排序类型
      var type = $(this).data('type');
      console.log(type);
      // 3. 获取当前的排序顺序
      var sort = $(this).data('sort');
      if(sort==1){
          sort=2
          $(this).find('i').removeClass('fa-angle-down').addClass('fa-angle-up');
      
      }else{
          sort=1
          $(this).find('i').removeClass('fa-angle-up').addClass('fa-angle-down');
      
      }
    $(this).addClass('active').siblings().removeClass('active')
    var obj = {
        proName: search,
        page: 1,
        pageSize: 4                               
    }
    obj[type] = sort;
    ajaxProduct(obj)
    })
}
})
//点击查看详情功能
function productDetail (){
$('.firstRow').on('tap','.mui-btn-outlined',function  (){
    // console.log(this);
    
var id=$(this).data('id')
console.log(id);
// return;
   // 3. 跳转到商品详情并且把id传过去
   location = 'detail.html?id=' + id;

})
}
//排序思路
// 1-获取每个元素.给每个元素添加点击事件
// 2-