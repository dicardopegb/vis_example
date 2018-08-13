import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import Scatter from './Scatter'
import BarPlot from './BarPlot'
import ScatterPlot from './ScatterPlot'
import LinePlot from './LinePlot'
import DonutChart from './DonutChart'
import SunBurst from './SunBurst'
import createData from "./createData"
import data_timeseries from './data_timeseries';
import data from "./sunburst_data";
import timeSeriesCreator from "./timeSeries";

class App extends Component {

	constructor(props){
		super(props);
		this.state = {
			containerWidth: 700,
			containerHeight: 520
		};
	}

  render() {
    return (
			<div className = "App">
			  <header className = "App-header">
			    <img src = {logo} className = "App-logo" alt = "logo"/>
			    <h1 className="Prueba">PegB Test</h1>
			  </header>
				<p>Click</p>
				<Scatter data = { createData(50, "bar") }
								 w = {700}
								 h = {500}
								 padding = {2}
								 margin = {{ top: 20, right: 20, bottom: 40, left: 50 }} />
				<DonutChart data = { data_timeseries.results }
										width = {500}
										height = {500}
										padding = {8}
										margin = {{ top: 30, right: 50, bottom: 40, left: 80 }}
										segments = {[{ key: "cash_in_count" }, { key: "cash_out_count" }]} />
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
					width={900}
					height={600}
					padding = {8}
					x={{ key: "date" }}
					y1={{ key: "cash_in_amount" }}
					y2={{ key: "cash_out_amount" }}
				/>
			</div>
		);
  }

	// componentDidMount() {
	// 	window.onresize = ({ target: { innerHeight, innerWidth } }) =>
	// 	 	console.log(innerWidth, innerHeight) ||
	// 		this.setState({ containerWidth: innerWidth, containerHeight: innerHeight });
	// }
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
