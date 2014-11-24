//添加激活状态
function menuActive(id) {
    $('#'+id).addClass("active");
}

//移除激活状态
function menuUnActive(id) {
    $('#'+id).removeClass("active");
}

function changeActive(id,other) {
    $('#'+id).addClass("active");
    for(var i = 0; i < other.length; i++) {
        $('#'+other[i]).removeClass("active");
    }
}