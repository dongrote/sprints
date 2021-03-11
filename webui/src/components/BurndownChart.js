import { Chart } from 'react-google-charts';
import day from 'dayjs';

const dailyPoints = (pointSets, labels) => {
  const today = day().startOf('d'),
    { net, inc, dec, ideals } = pointSets,
    dailyPoints = [];
  net.forEach((remaining, idx) => {
    const dailyPointsDay = day(labels[idx], 'MM/DD/YYYY'),
      added = inc[idx],
      removed = dec[idx];
    let ideal = null;
    if (idx === 0) ideal = ideals[0];
    if (idx === net.length - 1) ideal = 0;
    dailyPoints.push({
      label: dailyPointsDay.format('M/D'),
      ideal,
      remaining,
      added,
      removed,
      addRemoveTooltip: `${dailyPointsDay.format('ddd MMM D')} (+${added}/-${removed})`,
      remainingTooltip: `${dailyPointsDay.format('ddd MMM D')}; ${remaining} points`,
      remainingCertainty: dailyPointsDay.isBefore(today),
    });
  });
  return dailyPoints;
};

const dataSchema = [
  'Day',
  'Claimed', {role: 'tooltip'},
  'Removed', {role: 'tooltip'},
  'Ideal',
  'Net Remaining', {role: 'tooltip'}, {role: 'certainty'},
];

const dailyPointsToSchema = dp => [
  dp.label,
  dp.added, dp.addRemoveTooltip,
  dp.removed, dp.addRemoveTooltip,
  dp.ideal,
  dp.remaining, dp.remainingTooltip, dp.remainingCertainty,
];

const BurndownChart = props => (
  <Chart
    chartType='ComboChart'
    loader={<div>Loading Data ...</div>}
    data={[dataSchema].concat(dailyPoints({net: props.net, inc: props.inc, dec: props.dec, ideals: props.ideals}, props.labels).map(dailyPointsToSchema))}
    options={{
      animation: {startup: true, duration: 100, easing: 'in'},
      hAxis: {viewWindow: {min: 0}, maxAlternation: 2},
      vAxis: {minValue: 0},
      legend: {position: 'top'},
      isStacked: true,
      interpolateNulls: true,
      series: {
        0: { type: 'bars', color: 'blue', isStacked: true },
        1: { type: 'bars', color: 'purple', isStacked: true },
        2: { type: 'line', color: 'orange', lineDashStyle: [4, 1], pointsVisible: false },
        3: { type: 'line', color: '#B40F0A', pointSize: 5 },
      },
    }}
  />
);


export default BurndownChart;
