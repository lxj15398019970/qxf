<%@ page contentType="text/html;charset=UTF-8"%>
<%@ include file="/WEB-INF/common/taglibs.jsp"%>
<c:set var="page" value="account" />

<!DOCTYPE html>
<html lang="zh-cn">
<head>

<title>抢媳妇</title>
<style> 
.xr1
{
width:100px;
height:100px;
background:url("../static/image/xr.gif");
position:relative;

/* Firefox: */
-moz-animation-name:myfirst;
-moz-animation-duration:10s;
-moz-animation-timing-function:ease;
-moz-animation-delay:2s;
-moz-animation-iteration-count:infinite;
-moz-animation-direction:alternate;
-moz-animation-play-state:running;
}




@-moz-keyframes myfirst /* Firefox */
{
0%   {left:100px; top:0px;}
25%  {left:900px; top:0px;}
50%  {left:1000px; top:500px;}
75%  {left:100px; top:500px;}
100% {left:100px; top:0px;}
}




.line1{
  border:1px solid;
  margin-left: 100px;
  margin-right: 100px;
  margin-top: 1px
}


.line2{
  border:1px solid;
  margin-left: 100px;
  margin-right: 1000px;
  margin-top: 1px;
  margin-bottom: 1px
}



</style>

</head>


<body>

	<div class = "xr1"></div>
	<div  class = "line1"></div>
	<div  class = "line2"></div>
	
</body>
</html>
