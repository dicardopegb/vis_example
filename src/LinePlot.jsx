import React, {Component} from "react";
import * as d3 from "d3";
import S from "string";

const PEGB_BI_CLASS = "pegb-pi";

const defXScale = ({key, dataset, width, padding}) => (d3.scaleTime().domain([
  d3.min(dataset, (d) => d[key]),
  d3.max(dataset, (d) => d[key])
]).range([
  padding, width - padding * 5
]).clamp(true));

const defYScale = ({key, height, padding, dataset}) => (d3.scaleLinear().domain([
  d3.min(dataset, (d) => d[key]),
  d3.max(dataset, (d) => d[key])
]).range([
  height - padding,
  padding
]));

class LinePlot extends Component {

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
    d3.select(this.arc).append("svg").append("g");
    this.plot();
  }

  componentDidUpdate() {
    this.plot();
  }

  plot() {
    const {
      width: w,
      height: h,
      margin,
      padding,
			className,
      data: dataset,
      x: {
        key: xkey,
        label: xlabel,
        scale: xScale
      },
      y1: {
        key: y1key,
        label: y1label,
        scale: y1Scale
      },
      y2: {
        key: y2key,
        label: y2label,
        scale: y2Scale
      }
    } = this.props;

    const svg = d3.select(this.arc).select(svg).attr("width", w).attr("height", h);

    const width = svg.attr("width") - margin.left - margin.right;
    const height = svg.attr("height") - margin.top - margin.bottom;

		const context = svg.select("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const x_scale = xScale || defXScale({key: xkey, dataset, padding, width});
    const y_scale = y1Scale || defYScale({key: y1key, dataset, padding, height});
    const y_scale2 = y2Scale || defYScale({key: y2key, dataset, padding, height});

    const xaxis = d3.axisBottom().scale(x_scale);
    const yaxis = d3.axisLeft().scale(y_scale);
    const yaxis2 = d3.axisRight().scale(y_scale2);

    const line = d3.line().x(d => x_scale(d[xkey])).y(d => y_scale(d[y1key]));

    const line2 = d3.line().x(d => x_scale(d[xkey])).y(d => y_scale2(d[y2key]));

    context.append("path").datum(dataset)
			.attr("class", `${PEGB_BI_CLASS} line ${y1key} serie1 ${className}`)
			.attr("d", line).attr("id", "line1");

    context.append("path").datum(dataset)
			.attr("class", `${PEGB_BI_CLASS} line ${y2key} serie2 ${className}`)
			.attr("d", line2).attr("id", "line2");

    context.append("g").attr("class", `${PEGB_BI_CLASS} x axis ${className}`)
			.attr("transform", "translate(0, " + height + ")")
			.attr("id", "xaxis").call(xaxis);

    context.append("g").attr("class", `${PEGB_BI_CLASS} y axis ${className}`)
			.attr("transform", "translate(" + padding + ", 0)")
			.attr("id", "yaxis1").call(yaxis).selectAll("text")
			.attr("class", `${PEGB_BI_CLASS} ${y1key} serie1 ${className}`);

    context.append("g").attr("class", `${PEGB_BI_CLASS} x axis ${className}`)
			.attr("transform", "translate(" + (width - padding * 5) + ", 0)")
			.attr("id", "yaxis2").call(yaxis2).selectAll("text")
			.attr("class", `${PEGB_BI_CLASS} ${y2key} serie2 ${className}`);

		const xLabel = xlabel || S(xkey).humanize().s;
    const y1Label = y1label || S(y1key).humanize().s;
    const y2Label = y2label || S(y2key).humanize().s;

    context.append("text")
			.attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 10) + ")")
			.text(xLabel)
			.attr("class", `${PEGB_BI_CLASS} labels ${className}`)
			.style("text-anchor", "middle");

    context.append("text")
			.attr("class", `${PEGB_BI_CLASS} ${y1key} serie1 legend ${className}`)
			.attr("transform", "rotate(-90)")
			.attr("y", -margin.left)
			.attr("x", 0 - (height / 2)).attr("dy", "1em").text(y1Label)
			.style("text-anchor", "middle");

    context.append("text")
			.attr("class", `${PEGB_BI_CLASS} legend ${y2key} serie2 legend ${className}`)
			.attr("transform", "rotate(-90)")
			.attr("y", width + 15)
			.attr("x", 0 - (height / 2))
			.attr("dy", "1em")
			.text(y2Label)
			.style("text-anchor", "middle");

    context.append("g")
			.attr("class", `${PEGB_BI_CLASS} grid ${className}`)
			.attr("transform", "translate(0," + height + ")")
			.call(d3.axisBottom(x_scale).tickSize(-height).tickFormat(""));

    context.append("g")
		.attr("class", `${PEGB_BI_CLASS} grid ${className}`)
		.call(d3.axisLeft(y_scale).tickSize(-width + padding * 5).tickFormat(""));
  }
}

LinePlot.defaultProps = {
	className: ""
};

export default LinePlot;
