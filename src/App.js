import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
// import Scatter from './Scatter'
import BarPlot from './BarPlot'
import ScatterPlot from './ScatterPlot'
import LinePlot from './LinePlot'
import DonutChart from './DonutChart'
import SunBurst from './SunBurst'
import createData from "./createData"
import data_timeseries from './data_timeseries';
import data from "./sunburst_data";
import timeSeriesCreator from "./timeSeries";
import Dashboard from "./Dashboard";

class App extends Component {

	constructor(props){
		super(props);
	}

  render() {
    return (
			<div className="App centered">
				<Dashboard
					transactionsByDate={timeSeriesCreator()}
					transactionsByInstitution={data.results}
				/>
				{/*<Scatter data = { createData(50, "bar") }
				w = {700}
				h = {500}
				padding = {2}
				margin = {{ top: 20, right: 20, bottom: 40, left: 50 }} />
				<BarPlot
					data = { timeSeriesCreator() }
					margin = {{ top: 20, right: 20, bottom: 40, left: 50 }}
					padding={2}
					width={this.state.containerWidth}
					height={this.state.containerHeight}
					x="date"
					y="cash_in_amount"
				/>
				<LinePlot
					data = { timeSeriesCreator() }
					margin = {{ top: 30, right: 50, bottom: 40, left: 80 }}
					width={this.containerWidth / 2}
					height={this.containerHeight / 2}
					padding = {8}
					x={{ key: "date" }}
					y1={{ key: "cash_in_amount" }}
					y2={{ key: "cash_out_amount" }}
				/>
				*/}
			</div>
		);
  }
}

export default App;

// <Scatter data = { createData(50, "bar") }
// 				 w = {700}
// 				 h = {500}
// 				 padding = {2}
// 				 margin = {{ top: 20, right: 20, bottom: 40, left: 50 }} />

// <BarPlot data = { createData(20, "bar") }
// 				 w = {700}
// 				 h = {500}
// 				 padding = {2}
// 				 margin = {{ top: 20, right: 20, bottom: 40, left: 50 }} />

// <ScatterPlot data = { createData(20, "bar") }
// 						  w = {700}
// 						  h = {500}
// 						  padding = {30}
// 						  margin = {{ top: 20, right: 20, bottom: 40, left: 50 }} />

// <LinePlot data = { data_timeseries.results }
// 					w = {900}
// 					h = {600}
// 					padding = {8}
// 					margin = {{ top: 30, right: 50, bottom: 40, left: 80 }}
// 					variable = "count" />

// <DonutChart data = { data_timeseries.results }
// 						w = {500}
// 						h = {500}
// 						padding = {8}
// 						margin = {{ top: 30, right: 50, bottom: 40, left: 80 }}
// 						variable = "average" />

// <SunBurst data = { data }
// 					w = {700}
// 					h = {500} />
