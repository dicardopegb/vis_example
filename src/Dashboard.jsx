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
import DetailSunburst from "./DetailSunburst";
import DonutChart from "./DonutChart";
import grouper from "./groupRecursevely";

const colors = ["blue", "teal", "tomato", "green", "red", "orange", "violet", "crimson"];

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
  prune: true
});

const FlexibleSunburst = makeVisFlexible(Sunburst);

export default ({ transactionsByDate, transactionsByInstitution }) => (
  <div className="container row" style={{ minWidth: "70%" }}>
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
          <div className="container widget">
            <h4>Distribution by institutions</h4>
            <DetailSunburst
              data={{
                name: "root",
                children: groupRecursively(
                  transactionsByInstitution,
                  ["institution_type", "institution_name"]
                )
              }}
              center={{x: 0, y: 0}}
              className="graph"
              getSize={d => d.total}
              getColor={d => d.color}
              style={{ minWidth: "400px" }}
            />
          </div>
          <div className="container widget">
            <h4>Distribution by status</h4>
            <DonutChart
              style={{ minWidth: "400px" }}
              className="graph"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);
