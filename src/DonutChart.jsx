import React, {Component} from "react";
import * as d3 from "d3";
import S from "string";

const calculateLabel = ({ label, key }) => label || S(key).humanize().s;

class DonutChart extends Component {

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
      className,
      data,
      segments
    } = this.props;

    const svg = d3.select(this.arc).append("svg").attr("width", w).attr("height", h);

    const width = svg.attr("width") - margin.left - margin.right;
    const height = svg.attr("height") - margin.top - margin.bottom;

    const context = svg.append("g")
			.attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")");

    const radius = Math.min(width, height) / 2;

    const donutWidth = 50;

		const tooltip = context.append("g");

		tooltip.append("rect")
			.attr("height", 80).attr("width", 80)
			.attr("class", "tooltip")
			.attr("transform", (d, i) => {
	      var horz = -50;
	      var vert = -90;
	      return "translate(" + horz + "," + vert + ")";
	    });

		tooltip.append("text").attr("class", "label");
		tooltip.append("text").attr("class", "count");
		tooltip.append("text").attr("class", "percent");

    const dataset = segments.map(s => ({
      ...s,
      value: data.reduce((acc, d) => d[s.key] + acc, 0)
    }));

    const color = d3.scaleOrdinal(d3.schemeCategory10);
    const arc = d3.arc().innerRadius(radius - donutWidth).outerRadius(radius);

    const pie = d3.pie().value(d => d.value).sort(null);

    const legendRectSize = 18;
    const legendSpacing = 4;

    const path = context.selectAll("path").data(pie(dataset)).enter()
			.append("path").attr("d", arc).attr("fill", (d, i) => color(calculateLabel(d.data)));

    path.on("mouseover", d => {
      const total = d3.sum(dataset.map(d => d.value));
      const percent = 100 * d.data.value / total;
      tooltip.select(".label").text(calculateLabel(d.data));
			tooltip.select(".count").text(d.data.value);
			tooltip.select(".percent").text(percent.toFixed(2) + "%");
      tooltip.style("display", "block");
    });

    path.on("mouseout", function () {
      tooltip.style("display", "none");
    });

    var legend = context.selectAll(".legend").data(color.domain()).enter()
			.append("g").attr("class", "legend")
			.attr("transform", (d, i) => {
	      var height = legendRectSize + legendSpacing;
	      var offset = height * color.domain().length / 2;
	      var horz = -2 * legendRectSize;
	      var vert = i * height + 30;
	      return "translate(" + horz + "," + vert + ")";
	    });

    legend.append("rect").attr("width", legendRectSize).attr("height", legendRectSize)
			.style("fill", color).style("stroke", color);

    legend.append("text").attr("x", legendRectSize + legendSpacing)
			.attr("y", legendRectSize - legendSpacing).text(d => d);
  }
}
export default DonutChart;
