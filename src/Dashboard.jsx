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
  DiscreteColorLegend
} from "react-vis";
import grouper from "./groupRecursevely";

const colors = ["blue", "teal", "tomato", "green"];

const groupRecursively = grouper({
  pivotValKey: "title",
  aggregate: (children, pos) => ({
    size: children.reduce((acc, c) => c.size + acc, 0)
  }),
  computeLevel: ({ index, key, value }) => ({
    color: colors[index],
  })
});

const FlxibleSunburst = makeWidthFlexible(Sunburst);

const myData = {
 "title": "analytics",
 "color": "#12939A",
 "children": [
  {
   "title": "cluster",
   "children": [
    {"title": "AgglomerativeCluster", "color": "#12939A", "size": 3938},
    {"title": "CommunityStructure", "color": "#12939A", "size": 3812},
    {"title": "HierarchicalCluster", "color": "#12939A", "size": 6714},
    {"title": "MergeEdge", "color": "#12939A", "size": 743}
   ]
  },
  {
   "title": "graph",
   "children": [
    {"title": "BetweennessCentrality", "color": "#12939A", "size": 3534},
    {"title": "LinkDistance", "color": "#12939A", "size": 5731},
    {"title": "MaxFlowMinCut", "color": "#12939A", "size": 7840},
    {"title": "ShortestPaths", "color": "#12939A", "size": 5914},
    {"title": "SpanningTree", "color": "#12939A", "size": 3416}
   ]
  },
  {
   "title": "optimization",
   "children": [
    {"title": "AspectRatioBanker", "color": "#12939A", "size": 7074}
   ]
  }
 ]
};

export default ({ transactionsByDate, transactionsByInstitution }) => (
  <div className="container row" style={{ minWidth: "70%" }}>
    <div className="column widget" style={{ maxWidth: "100%" }}>
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
        <div className="container widget" style={{ maxHeight: "50%" }}>
          <h4>Transaction trend</h4>
          <FlexibleXYPlot
            getX={d => d.date}
            xType="time"
            getY={d => d.cash_in_amount}
            className="graph"
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
            <FlxibleSunburst
              hideRootNode
              colorType="literal"
              data={{ title: "root", children: groupRecursively(transactionsByInstitution, ["institution_type", "institution_name"]) }}
              height={400}
              center={{x: -10, y: -30}}
              style={{ minWidth: "400px" }}
              className="graph"
            />
          </div>
          <div className="container widget">
            <h4>Distribution by status</h4>
            <FlxibleSunburst
              colorType="literal"
              data={myData}
              height={400}
              center={{x: -10, y: -30}}
              style={{ minWidth: "400px" }}
              className="graph"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);
