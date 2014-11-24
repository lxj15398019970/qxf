define(function(require, exports, module) {
	var lock = require("lock");
	var dates = [];
	var datas = [];
	$.getJSON("account-request.shtml", function(data) {
		for (var i = data.length-1; i >= 0; i--) {
			dates.push(data[i].date);
			datas.push(data[i].requests);
		}
		lock.chart.lineChart(dates,datas);
	})
})




