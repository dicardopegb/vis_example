var formatDate = d3.timeFormat("%Y-%m-%d");
var slider = context.append("g")
										.attr("class", "slider")
										.attr("transform", "translate(" + 4 + ",-7)");

slider.append("line")
			.attr("class", "track")
			.attr("x1", padding)
			.attr("x2", width - padding * 5)
			.select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
			.attr("class", "track-inset")
			.select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
			.attr("class", "track-overlay")
			.call(d3.drag()
				.on("start.interrupt", function() { slider.interrupt(); })
				.on("start drag", function() { update(x_scale.invert(d3.event.x)); })
				.on("end", function() { filter_data(x_scale.invert(d3.event.x)); }));

slider.insert("g", ".track-overlay")
			.attr("class", "ticks")
			.attr("transform", "translate(0," + 10 + ")")
			.selectAll("text")
			.data(x_scale.ticks(8))
			.enter()
			.append("text")
			.attr("x", x_scale)
			.attr("y", 10)
			.attr("text-anchor", "middle")
			.text(function(d) { return formatDate(d); });

var label = slider.append("text")
									.attr("class", "label")
									.attr("text-anchor", "middle")
									.text(formatDate(x_scale.domain()[0]))
									.attr("transform", "translate(0," + (-12) + ")")
									.attr("font-size", "12px");

var handle = slider.insert("circle", ".track-overlay")
									 .attr("class", "handle")
									 .attr("r", 6);

function update(h) {
	handle.attr("cx", x_scale(h));
	label.attr("x", x_scale(h))
			 .text(formatDate(h));
}

function filter_data(h) {
	new_data = dataset.filter(d => d[xkey] >= h);
	var x_scale2 = d3.scaleTime()
									.domain([
										d3.min(new_data, (d) => d[xkey]),
										d3.max(new_data, (d) => d[xkey])
									])
									.range([padding, width - padding * 5]);

	var xaxis2 = d3.axisBottom().scale(x_scale2);
	y_scale.domain([
		d3.min(new_data, (d) => d[y1key]),
		d3.max(new_data, (d) => d[y1key])
	]);

	y_scale2.domain([
		d3.min(new_data, (d) => d[y2key]),
		d3.max(new_data, (d) => d[y2key])
	]);

 line = d3.line().x(d => x_scale2(d[xkey])).y(d => y_scale(d[y1key]));

 line2 = d3.line().x(d => x_scale2(d[xkey])).y(d => y_scale2(d[y2key]));

	context.select("#line1")
		.datum(new_data)
		.transition()
		.duration(500)
		.attr("class", "line")
		.style("stroke", "#11B4B1")
		.attr("d", line);;

	context.select("#line2")
		.datum(new_data)
		.transition()
		.duration(500)
		.attr("class", "line")
		.style("stroke", "#ff0066")
		.attr("d", line2);

	context.select("#xaxis")
		 .transition()
		 .duration(1000)
		 .call(xaxis2);

	context.select("#yaxis1")
		.transition()
		.duration(1000)
		.attr("transform", "translate(" + padding + ", 0)")
		.call(yaxis)
		.selectAll("text")
		.attr("fill", "#11B4B1");

	context.select("#yaxis2")
		.transition()
		.duration(1000)
		.attr("transform", "translate(" + (width - padding * 5) + ", 0)")
		.call(yaxis2)
		.selectAll("text")
		.attr("fill", "#ff0066");
}
