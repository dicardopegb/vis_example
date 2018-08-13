import data from "./sunburst_data"

var createData = (obs, type) => {
	var dataset = [];
	var observations = obs;

	if (type === "bar") {
		var x_range = Math.random() * 100;
		var y_range = Math.random() * 100;

		for (var i = 0; i <= observations; i++) {
			var aux_1 = Math.round(Math.random() * x_range);
			var aux_2 = Math.round(Math.random() * y_range);
			dataset.push([aux_1, aux_2]);
		}
	} else {
		var start_year = 2000;
		var end_year = 2017;

		for (i = start_year; i <= end_year; i++) {
			for (var j = 0; j < 12; j++) {
				var year = i;
				var month = j;
				var cashin = Math.random() * 100;
				var cashout = Math.random() * 10;
				dataset.push({year: year, month: month, cashin: cashin, cashout: cashout});
			}
		}
	}
	return dataset;
};

export default createData;
