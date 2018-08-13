import React, { Component } from 'react'
import * as d3 from 'd3'
import createData from './createData'

class ScatterPlot extends Component {

	render() {
		return (
			<div ref = "arc"></div>
		);
	}

	componentDidMount() {
		const context = this.getContext();
		this.plot(context);
  }

	getContext() {
		var w = this.props.w;
		var h = this.props.h;
		var svg = d3.select(this.refs.arc)
								.append("svg")
								.attr("width", w)
								.attr("height", h);
		return svg;
	}

  plot(context) {
		var w = this.props.w;
		var h = this.props.h;
		var margin = this.props.margin;
		var padding = this.props.padding;
		var dataset = this.props.data;

		var x_scale = d3.scaleLinear()
								 	 .domain([0, d3.max(dataset, function(d) { return d[0]; })])
								 	 .range([padding, w - padding * 2]);

		var y_scale = d3.scaleLinear()
								 		.domain([0, d3.max(dataset, function(d) { return d[1]; })])
								 		.range([h - padding, padding]);

		var xaxis = d3.axisBottom()
							  	.scale(x_scale)
							  	.ticks(5);

		var yaxis = d3.axisLeft()
							  	.scale(y_scale)
							  	.ticks(5);

		context.selectAll("circle")
					 .data(dataset)
					 .enter()
					 .append("circle")
					 .attr("cx", function(d) { return x_scale(d[0]); })
					 .attr("cy", function(d) { return y_scale(d[1]); })
					 .attr("r", 2);

		context.append("g")
					 .attr("class", "x axis")
					 .attr("transform", "translate(0," + (h - padding) + ")")
					 .call(xaxis);

		context.append("g")
					 .attr("class", "y axis")
					 .attr("transform", "translate(" + padding + ",0)")
					 .call(yaxis);

		d3.select("p")
			.on("click", function() {
					var numValues = dataset.length;
					dataset = createData(numValues, "bar");

					x_scale.domain([0, d3.max(dataset, function(d) { return d[0]; })]);
					y_scale.domain([0, d3.max(dataset, function(d) { return d[1]; })]);

					context.selectAll("circle")
							   .data(dataset)
							   .transition()
							   .duration(1000)
							   .on("start", function() {
								   d3.select(this)
								     .attr("fill", "magenta")
								     .attr("r", 7);
							   })
							   .attr("cx", function(d) {
							   		return x_scale(d[0]);
							   })
							   .attr("cy", function(d) {
							   		return y_scale(d[1]);
							   })
							   .on("end", function() {
								   d3.select(this)
								     .transition()
								     .duration(1000)
								     .attr("fill", "black")
								     .attr("r", 2);
							   });

					context.select(".x.axis")
						     .transition()
						     .duration(1000)
								 .call(xaxis);

					context.select(".y.axis")
						     .transition()
						     .duration(1000)
								 .call(yaxis);
				});

		return context;
  }
}
export default ScatterPlot;
