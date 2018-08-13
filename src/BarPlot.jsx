import React, { Component } from 'react'
import * as d3 from 'd3'

const defXScale = ({ data, x, width, padding }) => (
	d3.scaleTime()
		.domain([d3.min(data, function(d) {return d[x]; }), d3.max(data, function(d) {return d[x]; })])
		.range([padding, width - padding * 2])
);

const defYScale = ({ data, y, height, padding }) => (
	d3.scaleLinear()
		.domain([0, d3.max(data, function(d) { return d[y]; })])
		.range([height - padding, padding])
);

class BarPlot extends Component {

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
		const {
			width: w,
			height: h,
			margin,
			padding,
			data: dataset,
			x = 0,
			y = 1,
			xScale = defXScale,
			yScale = defYScale,
			className = ""
		} = this.props;

		const svg = d3.select(this.arc)
								.append("svg")
								.attr("class", `pegb-bi svg ${className}`)
								.attr("width", w)
								.attr("height", h);

		const context = svg.append("g")
								.attr("class", `pegb-bi g-container ${className}`)
					  		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		const width = w - margin.left - margin.right;
		const height = h - margin.top - margin.bottom;

		const x_scale = xScale({ ...this.props, width });
		const y_scale = yScale({ ...this.props, height });

		const xaxis = d3.axisBottom().scale(x_scale);
		const yaxis = d3.axisLeft().scale(y_scale);

		context.selectAll("rect")
					 .data(dataset)
					 .enter()
					 .append("rect")
					 .attr("x", function(d, i) { return i * ( width / dataset.length); })
					 .attr("y", function(d) { return y_scale(d[y]); })
					 .attr("width", width / dataset.length - padding)
					 .attr("height", function(d) { return height - y_scale(d[y]); })
					 .attr("class", `pegb-bi bar ${className}`);

		context.selectAll("text")
					 .data(dataset)
					 .enter()
					 .append("text")
					 .text(function(d) { return d[y]; })
					 .attr("text-anchor", "middle")
					 .attr("class", `pegb-bi bar-text ${className}`)
					 .attr("x", function(d, i) { return i * ( width / dataset.length) + (width / dataset.length - padding) / 2; })
					 .attr("y", function(d) { return y_scale(d[y]) + 14; });

		context.append("g")
					 .attr("class", "x axis")
					 .attr("transform", "translate(0, " + height + ")")
					 .call(xaxis);

		context.append("g")
			     .attr("class", "y axis")
			     .attr("transform", "translate(" - padding + ", 0)")
			     .call(yaxis);
  }
}

BarPlot.defaultProps = {
	x: 0,
	y: 1,
	className: ""
}

export default BarPlot;
