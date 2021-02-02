import { Chart } from 'react-google-charts';
import day from 'dayjs';

const BurndownChart = props => {
  const today = day().startOf('d'),
    dailyPoints = [];
  props.real.forEach((remaining, idx) => {
    const dailyPointsDay = day(props.labels[idx], 'MM/DD/YYYY');
    let ideal = null;
    if (idx === 0) ideal = props.ideal[0];
    if (idx === props.real.length - 1) ideal = 0;
    dailyPoints.push({
      label: dailyPointsDay.format('M/D'),
      ideal,
      remaining,
      tooltip: dailyPointsDay.format('ddd MMM D'),
      certainty: dailyPointsDay.isBefore(today),
    });
  });
  return (
  <Chart
    chartType='LineChart'
    loader={<div>Loading Data ...</div>}
    data={[['Day', 'Ideal', 'Real', {role: 'tooltip'}, {role: 'certainty'}]].concat(dailyPoints.map(dp => ([dp.label, dp.ideal, dp.remaining, dp.tooltip, dp.certainty])))}
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
