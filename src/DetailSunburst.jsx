//@flow
import React from 'react';

import { AreaSeries, makeVisFlexible, CustomSVGSeries, Sunburst } from "react-vis";
import { EXTENDED_DISCRETE_COLOR_RANGE } from "react-vis/dist/theme";

const CLASS = "pegb-bi-sunburst";

/**
 * Recursively work backwards from highlighted node to find path of valud nodes
 * @param {Object} node - the current node being considered
 * @returns {Array} an array of strings describing the key route to the current node
 */
const getKeyPath = (node) => {
  if (!node.parent) {
    return ['root'];
  }

  return [node.data && node.data.name || node.name].concat(getKeyPath(node.parent));
}

/**
 * Recursively modify data depending on whether or not each cell has been selected by the hover/highlight
 * @param {Object} data - the current node being considered
 * @param {Object|Boolean} keyPath - a map of keys that are in the highlight path
 * if this is false then all nodes are marked as selected
 * @returns {Object} Updated tree structure
 */
const updateData = (data, keyPath, path = "") => {
  if (data.children) {
    data.children.map(child => updateData(child, keyPath, `${path}.${data.name}`));
  }

  // add a fill to all the uncolored cells
  if (!data.color) {
    data.style = {
      fill: EXTENDED_DISCRETE_COLOR_RANGE[5]
    };
  }

  const shouldFade = keyPath && !keyPath[data.name];
  data.style = {
    ...data.style,
    fillOpacity: shouldFade ? 0.2 : 1
  };

  return data;
}

// const FlexibleSunburst = makeVisFlexible(Sunburst);

const Hint = ({ selected }) => {
  return (
    <g className={`${CLASS} inner-component`}>
      <text x={0} y={0}>
        <tspan x="-30" y="0" className={`${CLASS} hint-text`}>In count {selected.count}</tspan>
        <tspan x="-30" y="1em" className={`${CLASS} hint-text`}>$ {selected.total}</tspan>
        <tspan x="-30" y="2em" className={`${CLASS} hint-text`}>AVG {selected.avg.toFixed(2)}</tspan>
      </text>
    </g>
  );
};

export default class DetailSunburst extends React.Component {
  state = {
    pathValue: false,
    data: updateData(this.props.data, false),
    finalValue: 'SUNBURST',
    clicked: false
  }

  render() {
    const {clicked, data, finalValue, pathValue, selected} = this.state;
    return (
      <div className={`${CLASS} container`}>
        <Sunburst
          viewBox="0 0 100 100"
          animation
          className={CLASS}
          hideRootNode
          onValueMouseOver={node => {
            if (clicked) {
              return;
            }
            const path = getKeyPath(node).reverse();
            const pathAsMap = path.reduce((res, row) => {
              res[row] = true;
              return res;
            }, {});
            this.setState({
              selected: node,
              finalValue: path[path.length - 1],
              pathValue: path.join(' > '),
              data: updateData(data, pathAsMap)
            });
          }}
          onValueMouseOut={() => clicked ? () => {} : this.setState({
            pathValue: false,
            finalValue: false,
            data: updateData(data, false)
          })}
          onValueClick={() => this.setState({clicked: !clicked})}
          colorType="literal"
          data={data}
          {...this.props}
        >
          {selected && (
            <CustomSVGSeries
              customComponent={() => <Hint selected={selected} />}
              data={[{x: 50, y: 50 }]}
            />
          )}
        </Sunburst>
        <div className={`${CLASS} path-name`}>{pathValue}</div>
      </div>
    );
  }

}
