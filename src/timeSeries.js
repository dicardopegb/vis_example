import data from "./data_timeseries";

export default () => (
		data.results.map((d) => {
			const date = new Date(+d.date.split("-")[0], +d.date.split("-")[1] - 1, +d.date.split("-")[2]);
			return { ...d, date };
		})
);
