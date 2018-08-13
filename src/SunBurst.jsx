import React, { Component } from "react"
import * as d3 from "d3"

class SunBurst extends Component {

	render() {
		return (
			<div ref = "arc"></div>
		);
	}

	componentDidMount() {
    const context = this.getContext();
		const dataset = this.getData();
		this.plot(context, dataset);
  }

	getContext() {
		var w = this.props.w;
		var h = this.props.h;
		var svg = d3.select(this.refs.arc)
								.append("svg")
		    				.attr("width", w)
		    				.attr("height", h)
		  					.append("g")
		    				.attr("transform", "translate(" + w / 2 + "," + (h / 2) + ")");
		return svg;
	}

	getData() {
		var data = this.props.data;
		const dataset = {
			name: "cashin",
			children: [
				{
					name: data.results[1].institution_name,
					children: [
						{
							name: data.results[1].institution_type,
							children: [
								{
									name: "amount",
									size: data.results[1].cash_in_amount
								}
							]
						},
						{
							name: data.results[2].institution_type,
							children: [
								{
									name: "amount",
									size: data.results[2].cash_in_amount
								}
							]
						}
					]
				},
				{
					name: data.results[3].institution_name,
					children: [
						{
							name: data.results[3].institution_type,
							children: [
								{
									name: "amount",
									size: data.results[3].cash_in_amount
								}
							]
						},
						{
							name: data.results[4].institution_type,
							children: [
								{
									name: "amount",
									size: data.results[4].cash_in_amount
								}
							]
						}
					]
				},
				{
					name: data.results[5].institution_name,
					children: [
						{
							name: data.results[5].institution_type,
							children: [
								{
									name: "amount",
									size: data.results[5].cash_in_amount
								}
							]
						}
					]
				}
			]
		};
		return dataset;
	}

  plot(context, dataset) {
		var w = this.props.w;
		var h = this.props.h;
	  var radius = (Math.min(w, h) / 2) - 10;
		var formatNumber = d3.format(",d");

		var x = d3.scaleLinear()
	    				.range([0, 2 * Math.PI]);

		var y = d3.scaleSqrt()
	    			  .range([0, radius]);

		var color = d3.scaleOrdinal(d3.schemeCategory10);
		var partition = d3.partition();

		var arc = d3.arc()
		    				.startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x0))); })
		    				.endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x1))); })
		    				.innerRadius(function(d) { return Math.max(0, y(d.y0)); })
		    				.outerRadius(function(d) { return Math.max(0, y(d.y1)); });

		var root = d3.hierarchy(dataset);
		root.sum(function(d) { return d.size; });
	  context.selectAll("path")
	     		 .data(partition(root).descendants())
	         .enter()
					 .append("path")
			     .attr("d", arc)
			     .style("fill", function(d) { return color((d.children ? d : d.parent).data.name); })
					 .style("stroke", "#fff")
			     .on("click", click)
			     	.append("title")
			     	.text(function(d) { return d.data.name + "\n" + formatNumber(d.value); });

		function click(d) {
	  	context.transition()
			     	 .duration(750)
			     	 .tween("scale", function() {
			         var xd = d3.interpolate(x.domain(), [d.x0, d.x1]),
			             yd = d3.interpolate(y.domain(), [d.y0, 1]),
			             yr = d3.interpolate(y.range(), [d.y0 ? 20 : 0, radius]);
			         return function(t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); }; })
			     	 .selectAll("path")
			       .attrTween("d", function(d) { return function() { return arc(d); }; });
		 }

		d3.select(this.frameElement)
	  	.style("height", h + "px");
	}
}
export default SunBurst;
