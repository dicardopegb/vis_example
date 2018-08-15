//@flow
import React, { Component } from 'react';
import { RadialChart, Hint, makeVisFlexible } from 'react-vis';

const FlexibleRadialChart = makeVisFlexible(RadialChart);

export default class DonutChart extends Component {
  state = {
    value: false
  }
  render() {
    const {value} = this.state;
    return (
      <FlexibleRadialChart
        className={'donut-chart-example'}
        innerRadius={100}
        radius={140}
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
        {value && <Hint value={value}/>}
      </FlexibleRadialChart>
    );
  }
}
