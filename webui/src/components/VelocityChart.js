import { Chart } from 'react-google-charts';

const VelocityChart = props => {
  const mean = props.velocities.length ? props.velocities.reduce((acc, val) => acc + val) / props.velocities.length : 0;
  return (
    <Chart
      chartType='ComboChart'
      loader={<div>Loading Data ...</div>}
      data={[['Sprint', 'Velocity', {role: 'certainty'}, `Average Velocity (${mean})`]].concat(props.velocities.map((v,i) => ([`${i}`, v, i < (props.velocities.length - 1), mean])))}
      options={{
        animation: {startup: true, duration: 200, easing: 'in'},
        title: 'Project Velocity',
        hAxis: {viewWindow: {min: 0}, title: 'Sprints'},
        vAxis: {minValue: 0},
        legend: {position: 'in'},
        series: {
          0: { type: 'bars', color: 'blue', visibleInLegend: false },
          1: { type: 'line', color: 'purple', lineWidth: 1, opacity: 0.3, pointsVisible: false },
        },
      }}
    />
  );
};

export default VelocityChart;
