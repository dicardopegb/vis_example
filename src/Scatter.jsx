import React, { Component } from 'react'
import * as d3 from 'd3'

// const animate = () => {
// 			var numValues = dataset.length;
// 			// dataset = createData(numValues, "bar");
//
// 			x_scale.domain([0, d3.max(dataset, function(d) { return d[0]; })]);
// 			y_scale.domain([0, d3.max(dataset, function(d) { return d[1]; })]);
//
// 			context.selectAll("circle")
// 						 .data(dataset)
// 						 .transition()
// 						 .duration(1000)
// 						 .on("start", function() {
// 							 d3.select(this)
// 								 .attr("fill", "magenta")
// 								 .attr("r", 7);
// 						 })
// 						 .attr("cx", function(d) {
// 								return x_scale(d[0]);
// 						 })
// 						 .attr("cy", function(d) {
// 								return y_scale(d[1]);
// 						 })
// 						 .on("end", function() {
// 							 d3.select(this)
// 								 .transition()
// 								 .duration(1000)
// 								 .attr("fill", "black")
// 								 .attr("r", 2);
// 						 });
//
// 			context.select(".x.axis")
// 						 .transition()
// 						 .duration(1000)
// 						 .call(xaxis);
//
// 			context.select(".y.axis")
// 						 .transition()
// 						 .duration(1000)
// 						 .call(yaxis);
// }

class Scatter extends Component {

	render() {
		return (
			<div
				ref={(r) => this.arc = r}
				className={this.props.className}
				style={this.props.style}
			/>
		);
	}

	componentDidMount() {
		this.plot();
  }

  plot() {

		var w = this.props.w;
		var h = this.props.h;
		var padding = this.props.padding;
		var margin = this.props.margin;
		var dataset = this.props.data;

		var svg = d3.select(this.arc).append('svg')
								.attr("height", h)
								.attr("width", w)
								.attr("id", "my_svg");

		var width = svg.attr("width") - margin.left - margin.right;
		var height = svg.attr("height") - margin.top - margin.bottom;

		var context = svg.append("g")
					  				 .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		var x_scale = d3.scaleLinear()
										.domain([0, d3.max(dataset, function(d) {return d[0];})])
										.range([padding, width - padding]);

		var y_scale = d3.scaleLinear()
										.domain([0, d3.max(dataset, function(d) {return d[1];})])
										.range([height - padding, padding]);

		var r_scale = d3.scaleLinear()
										.domain([0, d3.max(dataset, function(d) {return d[1];})])
										.range([2, 5]);

		var xaxis = d3.axisBottom(x_scale);
		var yaxis = d3.axisLeft(y_scale);

		context.selectAll("circle")
					 .data(dataset)
					 .enter()
					 .append("circle")
					 .attr("cx", function(d) { return x_scale(d[0]); })
					 .attr("cy", function(d) { return y_scale(d[1]); })
					 .attr("r", function(d) { return r_scale(d[1]); })
					 .attr("class", "circle");

		context.append("g")
					 .attr("class", "axis")
				   .attr("transform", "translate(0, " + height + ")")
				   .call(xaxis);

		context.append("g")
			     .attr("class", "axis")
			     .attr("transform", "translate(" - padding + ", 0)")
			     .call(yaxis);

		 context.append("g")
 			.attr("class", `${PEGB_BI_CLASS} grid ${className}`)
 			.attr("transform", "translate(0," + height + ")")
 			.call(d3.axisBottom(x_scale).tickSize(-height).tickFormat(""));

     context.append("g")
 		.attr("class", `${PEGB_BI_CLASS} grid ${className}`)
 		.call(d3.axisLeft(y_scale).tickSize(-width + padding * 5).tickFormat(""));
  }
}
export default Scatter;
