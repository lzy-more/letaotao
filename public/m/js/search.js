$(function() {
  addHistory();
  searchHistory();
  showHistory();
  scroll();
  clearALL ()
});
function scroll() {
  mui(".mui-scroll-wrapper").scroll({
    deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
  });
}
//新增历史记录
function addHistory() {
  $(".blueBtn").on("tap", function() {
    var text = $("#searchBar")
      .val()
      .trim();
    if (text == "") {
      alert("请输入合法的内容");
    }
    var arr=storageArr ()

    arr = uniq(arr);
    //判断当前的值是否在数组中存在
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] == text) {
        arr.splice(i, 1);
        // arr.remove(i)
        i--;
      }
    }
    arr.unshift(text);
    console.log(arr);
    localStorage.setItem("history", JSON.stringify(arr));
    $("#searchBar").val("");
    searchHistory();
    location='products.html?search='+text;
  });
}
//数组去重函数
function uniq(array) {
  var temp = []; //一个新的临时数组
  for (var i = 0; i < array.length; i++) {
    if (temp.indexOf(array[i]) == -1) {
      temp.push(array[i]);
    }
  }
  return temp;
}
//显示历史记录
function searchHistory() {
  var arr=storageArr ()
  var html = template("tpl", { list: arr });
  $(".mui-table-view").html(html);
}
//当行删除历史记录
function showHistory() {
  $(".mui-table-view").on('tap','li .delete-btn',function  (){
 var index=$(this).data('index')
 console.log(index);
 var arr=storageArr ()
 arr.splice(index,1);
//  arr = arr.remove(index)
//  console.log(arr)
 localStorage.setItem("history", JSON.stringify(arr));
 searchHistory()
  
  })

}
//清空历史记录
function clearALL (){
$('.btn-clear').on('tap',function(){
  console.log(111111);
  
  var arr=storageArr ()
  localStorage.removeItem('history')
  searchHistory()
})
}
function storageArr (){
  var arr = localStorage.getItem("history");
  // arr=JSON.parse(arr);
  if (arr == null) {
    // 5.2 只需要把arr赋值为空数组
    arr = [];
  } else {
    // 5.3 如果之前有数据 把字符串转成数组
    arr = JSON.parse(arr);
  }
  return arr;
}