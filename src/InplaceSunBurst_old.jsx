import React, { Component } from "react"
import * as d3 from "d3"

class InplaceSunBurst extends Component {

	render() {
		return (
			<div ref={r => this.arc = r} {...this.props} />
		);
	}

	componentDidMount() {
		d3.select(this.arc)
			.append("svg").attr("viewBox", "0 0 100 100")
			.append("g").attr("transform", "translate(50, 50)");
		this.plot();
  }

	componentDidUpdate() {
		this.plot();
	}

	getContext() {
		return d3.select(this.arc).select("svg").select("g");
	}

	onClick({ d, x, y, radius, arc }) {
		this.getContext().transition().duration(750)
		.tween("scale", () => {
			const xd = d3.interpolate(x.domain(), [d.x0, d.x1]);
			const yd = d3.interpolate(y.domain(), [d.y0, 1]);
			const	yr = d3.interpolate(y.range(), [d.y0 ? 20 : 0, radius]);
			return (t) => {
				x.domain(xd(t));
				y.domain(yd(t)).range(yr(t));
			};
		})
		.selectAll("path")
		.attrTween("d", d => () => arc(d));
	}

  plot() {
		const { data, getSize, getColor } = this.props;
		const formatNumber = d3.format(",d");
		const radius = 40;

		const x = d3.scaleLinear().range([0, 2 * Math.PI]);

		const y = d3.scaleSqrt().range([0, radius]);

		const partition = d3.partition();

		const arc = d3.arc()
		    				.startAngle(d => Math.max(0, Math.min(2 * Math.PI, x(d.x0))))
		    				.endAngle(d => Math.max(0, Math.min(2 * Math.PI, x(d.x1))))
		    				.innerRadius(d => Math.max(0, y(d.y0)))
		    				.outerRadius(d => Math.max(0, y(d.y1)));
		const context = this.getContext();
		const root = d3.hierarchy(data);
		root.sum(getSize);
		context.selectAll("path")
						.data(partition(root).descendants())
						.enter()
						.append("path").attr("d", arc)
						.style("fill", d => getColor(d))
						.style("stroke", "#fff")
						.on("click", (d) => this.onClick({ d, x, y, radius, arc }))
						.append("title")
						.text(d => `${d.data.name}\n${formatNumber(getSize(d))}`);

		// d3.select(this.frameElement).style("height", "500px");
	}
}

InplaceSunBurst.defaultProps = {
	getSize: d => d.size,
	getColor: d => d.color
};

export default InplaceSunBurst;
