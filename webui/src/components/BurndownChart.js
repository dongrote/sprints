import { Chart } from 'react-google-charts';

const BurndownChart = props => {
  const dailyPoints = [];
  props.real.forEach((remaining, idx) => {
    let ideal = null;
    if (idx === 0) ideal = props.ideal[0];
    if (idx === props.real.length - 1) ideal = 0;
    dailyPoints.push({ideal, remaining});
  });
  return (
  <Chart
    chartType='LineChart'
    loader={<div>Loading Data ...</div>}
    data={[['Day', 'Ideal', 'Real']].concat(dailyPoints.map((dp,i) => ([props.labels[i], dp.ideal, dp.remaining])))}
    options={{
      animation: {startup: true, duration: 100, easing: 'in'},
      legend: {position: 'top'},
      hAxis: {viewWindow: {min: 0}, maxAlternation: 2},
      vAxis: {minValue: 0},
      interpolateNulls: true,
      series: {
        0: {color: 'orange', lineDashStyle: [4, 1]},
        1: {color: 'blue', pointSize: 5},
      },
    }}
  />
);
  };

export default BurndownChart;
