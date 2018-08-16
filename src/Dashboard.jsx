//@flow
import React from "react";
import numeral from "numeral";
import {
  FlexibleXYPlot,
  XAxis,
  YAxis,
  HorizontalGridLines,
  VerticalGridLines,
  LineMarkSeries,
  Sunburst,
  makeWidthFlexible,
  makeHeightFlexible,
  makeVisFlexible,
  DiscreteColorLegend,
  PieChart
} from "react-vis";
import { EXTENDED_DISCRETE_COLOR_RANGE } from "react-vis/dist/theme";
import DetailSunburst from "./DetailSunburst";
import InplaceSunBurst from "./InplaceSunBurst";
import DonutChart from "./DonutChart";
import grouper from "./groupRecursevely";

const colors = EXTENDED_DISCRETE_COLOR_RANGE;

const groupRecursively = grouper({
  computeLevel: ({ index, key, value }) => ({
    color: colors[index],
    ...value.reduce(
      ({ total, count, avg }, c) => ({
        total: c.cash_in_amount ? c.cash_in_amount + total : total,
        count: c.cash_in_count ? c.cash_in_count + count : count,
        avg: c.cash_in_amount ? c.cash_in_amount / c.cash_in_count : avg
      }),
      { total: 0, count: 0, avg: 0 }
    )
  }),
  accumulate: ({ color, key }) => ({ color, key }),
  prune: true
});

const accumulateLegend = (children, acc) => (
  children.reduce(({ names, colors }, { name, color, children: c1 }) => (
    accumulateLegend(c1, { names: [...names, name], colors: [...colors, color] })
  ), acc)
);

export default class Dashboard extends React.Component {

  constructor(props) {
    super(props);
    const { transactionsByInstitution } = props;
    const groupedRows = groupRecursively(
      transactionsByInstitution,
      ["institution_type", "institution_name"]
    );
    const groupedColors = accumulateLegend(groupedRows, { names: [], colors: [] });
    this.state = {
      distributionByInstitution: groupedRows,
      groupedColors
    }
  }

  render() {
    const { transactionsByDate } = this.props;
    const { distributionByInstitution, groupedColors } = this.state;
    return (
      <div className="container row space">
        <div className="column widget">
          <h4>SUMMARY</h4>
          <div className="widget column">
            <p>1000.00</p>
            <p><span>Cash-In Total Amount</span></p>
          </div>
          <div className="widget column">
            <p>1000.00</p>
            <p><span>Cash-In Total Count</span></p>
          </div>
          <div className="widget column">
            <p>1000.00</p>
            <p><span>Cash-In Unique Customers</span></p>
          </div>
          <div className="widget column">
            <p>1000.00</p>
            <p><span>Cash-Out Total Amount</span></p>
          </div>
          <div className="widget column">
            <p>1000.00</p>
            <p><span>Cash-Out Total Count</span></p>
          </div>
        </div>
        <div className="container wrap" style={{ minWidth: "400px" }}>
          <div className="container">
            <div className="container widget">
              <h4>Transaction trend</h4>
              <FlexibleXYPlot
                getX={d => d.date}
                xType="time"
                getY={d => d.cash_in_amount}
                className="graph"
                style={{ padding: "0 10px" }}
              >
                <HorizontalGridLines />
                <VerticalGridLines />
                <LineMarkSeries data={transactionsByDate} />
                {/*<LineSeries
                  data={data}
                  getY={d => d.cash_out_amount}
                  yDomain={data.map(d => d.cash_out_amount)}
                />*/}
                <XAxis />
                <YAxis tickFormat={(v) => numeral(v).format("0.0a")} />
                {/*<YAxis
                  orientation="right"
                  getY={d => d.cash_out_amount}
                  yDomain={data.map(d => d.cash_out_amount)}
                  tickFormat={(v) => numeral(v).format("0.0a")}
                />*/}
              </FlexibleXYPlot>
              <DiscreteColorLegend
                orientation="horizontal"
                className="row centered"
                height={68}
                items={["Cash in", "Cash out"]}
              />
            </div>
            <div className="container row">
              <div className="container centered widget" style={{ minWidth: "400px", minHeight: "400px" }}>
                <h4>Distribution by institutions</h4>
                <DetailSunburst
                  data={{
                    name: "root",
                    children: distributionByInstitution
                  }}
                  center={{x: 0, y: 0}}
                  className="graph"
                  getSize={d => d.total}
                  getColor={d => d.color}
                />
                <DiscreteColorLegend
                  orientation="horizontal"
                  className="row centered"
                  items={groupedColors.names}
                  colors={groupedColors.colors}
                />
              </div>
              <div className="container centered widget" style={{ minWidth: "400px", minHeight: "400px" }}>
                <h4>Distribution by institutions</h4>
                <InplaceSunBurst
                  viewBox="0 0 100 100"
                  className="graph"
                  width={100}
                  height={100}
                  data={{
                    name: "root",
                    children: distributionByInstitution,
                    color: "teal"
                  }}
                  getSize={({ total }) => total}
                  getColor={({ color }) => color}
                />
                <DiscreteColorLegend
                  orientation="horizontal"
                  className="row centered"
                  items={groupedColors.names}
                  colors={groupedColors.colors}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

};
