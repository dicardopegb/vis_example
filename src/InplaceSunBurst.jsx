//@flow
import React from "react";
import { Sunburst, CustomSVGSeries } from "react-vis";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUndo } from "@fortawesome/free-solid-svg-icons";

const CLASS = "pegb-bi-sunburst-inplace";

const DIVERGING_COLOR_SCALE = ['#00939C', '#85C4C8', '#EC9370', '#C22E00'];

const Hint = ({ selected }) => {
  const { radius0, depth } = selected;
  const r = radius0 - (depth - 1) * 10;
  return (
    <g className={`${CLASS} inner-component`}>
      <circle x={50} y={50} r={r} color="black" opacity="0.7" />
      <text x={0} y={0}>
				<tspan x="-13%" y="-2em" className={`${CLASS} hint-text`}>{selected.name}</tspan>
        <tspan x="-13%" y="0em" className={`${CLASS} hint-text`}>Count {selected.count}</tspan>
        <tspan x="-13%" y="1em" className={`${CLASS} hint-text`}>$ {selected.total}</tspan>
        <tspan x="-13%" y="2em" className={`${CLASS} hint-text`}>AVG {selected.avg.toFixed(2)}</tspan>
      </text>
    </g>
  );
};

export default class InplaceSunBurst extends React.Component {
  constructor(props) {
    super(props);
		const { data } = props;
    this.state = { data };
  }

	updateData(node) {
    if (this.state.selected && this.state.selected.name === node.name) {
      return;
    }
		if (node.children && node.children.length > 0){
			const { children, name, color } = node;
			this.setState({ selected: node, parent: node.parent, data: { children, name, color } });
		} else {
      this.setState({ selected: node });
    }
	}

  canGoBack() {
    return this.state.parent;
  }

	goBack() {
    const { parent } = this.state;
		this.canGoBack() && this.updateData({ ...parent, ...parent.data });
	}

  render() {
		const { style, className, viewBox, height, width } = this.props;
    const { data, selected } = this.state;
    return (
			<div style={{ flex: 1, ...style }} className={`${CLASS}-container ${className}`}>
        {this.canGoBack() &&
          <button onClick={this.goBack.bind(this)} style={{
            border: 0,
            alignSelf: "flex-start",
            background: "rgba(0,0,0,0)",
            color: "red"
          }}>
            <FontAwesomeIcon icon={faUndo} />
          </button>
        }
	      <Sunburst
	        animation={{ damping: 20, stiffness: 300 }}
	        colorType="literal"
	        style={{ stroke: "#fff", ...style }}
					onValueClick={this.updateData.bind(this)}
	        height={height}
	        width={width}
	        viewBox={viewBox}
					className={className}
          {...this.props}
          viewBox="0 0 100 100"
          width={100}
          height={100}
					data={data}
	      >
				{selected && selected.total && (
					<CustomSVGSeries
						customComponent={() => <Hint selected={selected} />}
						data={[{ x: 0, y: 0 }]}
					/>
				)}
				</Sunburst>
			</div>
    );
  }

}
