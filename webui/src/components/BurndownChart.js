import { Chart } from 'react-google-charts';
import day from 'dayjs';

const BurndownChart = props => {
  const startDay = day(props.startDate),
    dailyPoints = [], xAxisLabels = [];
  props.real.forEach((remainingPoints, idx) => {
    const idealPoint = props.ideal.find(val => val[0] === idx);
    xAxisLabels.push(startDay.add(idx, 'd').format('M/D'));
    dailyPoints.push({remaining: remainingPoints, ideal: idealPoint === undefined ? null : idealPoint[1]});
  });
  return (
  <Chart
    chartType='LineChart'
    loader={<div>Loading Data ...</div>}
    data={[['Day', 'Ideal', 'Real']].concat(dailyPoints.map((dp,i) => ([xAxisLabels[i], dp.ideal, dp.remaining])))}
    options={{
      animation: {startup: true, duration: 100, easing: 'in'},
      legend: {position: 'top'},
      hAxis: {viewWindow: {min: 0}, title: 'Days', maxAlternation: 2},
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