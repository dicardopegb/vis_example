// Copyright (c) 2017 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import React from "react";
import numeral from "numeral";
import {
  XAxis,
  YAxis,
  HorizontalGridLines,
  XYPlot,
  LineSeries,
  Highlight,
  makeVisFlexible
} from "react-vis";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUndo } from "@fortawesome/free-solid-svg-icons";

const FlexibleXYPlot = makeVisFlexible(XYPlot);

export default class ZoomableChartExample extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      lastDrawLocation: null
    };
  }

  render() {
    const { lastDrawLocation } = this.state;
    const { series, style, className } = this.props;
    return (
      <div style={style} className={className}>
        <button
          onClick={() => this.setState({ lastDrawLocation: null })}
          style={{
            border: 0,
            alignSelf: "flex-start",
            background: "rgba(0,0,0,0)",
            color: "red"
          }}
        >
          <FontAwesomeIcon icon={faUndo} />
        </button>
        <FlexibleXYPlot
          animation
          xDomain={lastDrawLocation && [lastDrawLocation.left, lastDrawLocation.right]}
          yDomain={lastDrawLocation && [Math.max(lastDrawLocation.bottom, 0), Math.max(lastDrawLocation.top, 0)]}
          {...this.props}
          style={{ padding: 10 }}
        >
          <HorizontalGridLines />

          <YAxis tickFormat={(v) => numeral(v).format("0.0a")} />
          <XAxis tickLabelAngle={-90} />

          {series.filter(s => !s.disabled).map(entry =>
            <LineSeries
              key={entry.title}
              data={entry.data}
              curve="curveMonotoneX"
              left={lastDrawLocation && lastDrawLocation.left}
            />)
          }

          <Highlight
            onBrushEnd={area => this.setState({ lastDrawLocation: area })}
            onDrag={area => {
              this.setState({
                lastDrawLocation: {
                  bottom: lastDrawLocation.bottom + (area.top - area.bottom),
                  left: lastDrawLocation.left - (area.right - area.left),
                  right: lastDrawLocation.right - (area.right - area.left),
                  top: lastDrawLocation.top + (area.top - area.bottom)
                }
              });
            }}
          />
        </FlexibleXYPlot>
      </div>
    );
  }
}
