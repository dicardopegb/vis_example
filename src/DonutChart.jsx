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
    const g = d3.select(this.arc)
      .append("svg")
      .attr("viewBox", "0 0 100 100")
      .append("g");
    // const tooltip = g.append("g");
		// tooltip.append("rect")
		// 	.attr("height", 80).attr("width", 80)
		// 	.attr("class", "tooltip")
		// 	.attr("transform", (d, i) => {
	  //     var horz = -50;
	  //     var vert = -90;
	  //     return "translate(" + horz + "," + vert + ")";
	  //   });
    //
		// tooltip.append("text").attr("class", "label");
		// tooltip.append("text").attr("class", "count");
		// tooltip.append("text").attr("class", "percent");

    this.plot();
  }

  componentDidUpdate() {
    this.plot();
  }

  plot() {
    const {
      width: w,
      height: h,
      className,
      data,
      segments
    } = this.props;

    const context = d3.select(this.arc).select("svg").select("g")
      .attr("transform", "translate(50,50)");

    const dataset = segments.map(s => ({
      ...s,
      value: data.reduce((acc, d) => d[s.key] + acc, 0)
    }));

    const color = d3.scaleOrdinal(d3.schemeCategory10);
    const arcGenerator = d3.arc().innerRadius(20).outerRadius(40);
    const pieGenerator = d3.pie().value(d => d.value).sort(null);
    const pieData = pieGenerator(dataset);

    const legendRectSize = 18;
    const legendSpacing = 4;

    const path = context.selectAll("path").data(pieData).enter()
			.append("path").attr("fill", (d, i) => color(calculateLabel(d.data)))
      .attr("d", arcGenerator);

    // path.on("mouseover", d => {
    //   const total = d3.sum(dataset.map(d => d.value));
    //   const percent = 100 * d.data.value / total;
    //   tooltip.select(".label").text(calculateLabel(d.data));
		// 	tooltip.select(".count").text(d.data.value);
		// 	tooltip.select(".percent").text(percent.toFixed(2) + "%");
    //   tooltip.style("display", "block");
    // });
    //
    // path.on("mouseout", function () {
    //   tooltip.style("display", "none");
    // });

    var legend = context.selectAll(".legend").data(color.domain()).enter()
			.append("g").attr("class", "legend")
			.attr("transform", (d, i) => {
	      var height = legendRectSize + legendSpacing;
	      var offset = height * color.domain().length / 2;
	      var horz = -2 * legendRectSize;
	      var vert = i * height + 3;
	      return "translate(" + horz + "," + vert + ")";
	    });

    legend.append("rect").attr("width", 1).attr("height", 1)
			.style("fill", color).style("stroke", color);

    legend.append("text").attr("width", 5).attr("height", 1).text(d => d);
  }
}
export default DonutChart;
