import { Chart } from 'react-google-charts';

const BurndownChart = props => {
  const dailyPoints = [];
  props.ideal.forEach((points, i) => {
    dailyPoints.push({ideal: points, remaining: props.real[i]});
  });
  return (
  <Chart
    chartType='LineChart'
    loader={<div>Loading Data ...</div>}
    data={[['Day', 'Ideal', 'Real']].concat(dailyPoints.map((dp,i) => ([`${i + 1}`,dp.ideal, dp.remaining])))}
    options={{
      animation: {startup: true, duration: 500, easing: 'in'},
      legend: {position: 'top'},
      hAxis: {viewWindow: {min: 0}, title: 'Days'},
      vAxis: {minValue: 0},
      series: {
        0: {color: 'orange'},
        1: {color: 'blue'},
      },
    }}
  />
);
  };

export default BurndownChart;