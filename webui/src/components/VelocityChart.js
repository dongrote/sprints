import { Chart } from 'react-google-charts';

const VelocityChart = props => (
  <Chart
    chartType='ColumnChart'
    loader={<div>Loading Data ...</div>}
    data={[['Sprint', 'Velocity']].concat(props.velocities.map((v,i) => ([`${i}`,v])))}
    options={{
      animation: {startup: true, duration: 500, easing: 'in'},
      title: 'Project Velocity',
      hAxis: {viewWindow: {min: 0}, title: 'Sprints'},
      vAxis: {minValue: 0},
      legend: {position: 'none'},
      trendlines: {
        0: {type: 'linear', color: 'purple', lineWidth: 1, opacity: 0.3}
      },
    }}
  />
);

export default VelocityChart;