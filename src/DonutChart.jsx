//@flow
import React, { Component } from 'react';
import { RadialChart, Hint } from 'react-vis';

const CLASS = "pegb-bi-donut";

export default class DonutChart extends Component {
  state = {
    value: false
  }
  render() {
    const {value} = this.state;
    return (
      <RadialChart
        className={CLASS}
        innerRadius={20}
        radius={35}
        getAngle={d => d.theta}
        data={[
          {theta: 2, className: 'custom-class'},
          {theta: 6},
          {theta: 2},
          {theta: 3},
          {theta: 1}
        ]}
        onValueMouseOver={v => this.setState({value: v})}
        onSeriesMouseOut={v => this.setState({value: false})}
        {...this.props}
      >
        {value && <Hint value={value} />}
      </RadialChart>
    );
  }
}
