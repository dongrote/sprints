import { Component } from 'react';
import { Chart } from 'react-google-charts';
import day from 'dayjs';

const ChartStyles = {
  LINE: 'line',
  COLUMN: 'column',
};

export default class BurndownChart extends Component {
  state = { style: ChartStyles.LINE };

  toggleLineView() { this.setState({style: ChartStyles.LINE}); }
  toggleColumnView() { this.setState({style: ChartStyles.COLUMN}); }
  toggleView() { this.state.style === ChartStyles.LINE ? this.toggleColumnView() : this.toggleLineView(); }

  dailyNetPoints() {
    const today = day().startOf('d'),
      { net, labels, ideals } = this.props,
      dailyPoints = [];
    net.forEach((remaining, idx) => {
      const dailyPointsDay = day(labels[idx], 'MM/DD/YYYY');
      let ideal = null;
      if (idx === 0) ideal = ideals[0];
      if (idx === net.length - 1) ideal = 0;
      dailyPoints.push({
        label: dailyPointsDay.format('M/D'),
        ideal,
        remaining,
        tooltip: dailyPointsDay.format('ddd MMM D'),
        certainty: dailyPointsDay.isBefore(today),
      });
    });
    return dailyPoints;
  }

  dailyAddRemovePoints() {
    const { inc, dec, labels, ideals } = this.props,
      dailyPoints = [];
    inc.forEach((add, idx) => {
      const dailyPointsDay = day(labels[idx], 'MM/DD/YYYY'),
        remove = dec[idx];
      let ideal = null;
      if (idx === 0) ideal = ideals[0];
      if (idx === inc.length - 1) ideal = 0;
      dailyPoints.push({
        label: dailyPointsDay.format('M/D'),
        ideal,
        add,
        remove,
        tooltip: `${dailyPointsDay.format('ddd MMM D')} (+${add}/-${remove})`,
      });  
    });
    return dailyPoints;
  }

  renderColumn() {
    return (
      <Chart
      chartType='ComboChart'
      loader={<div>Loading Data ...</div>}
      data={[['Day', 'Ideal', 'Removed', {role: 'tooltip'}, 'Claimed', {role: 'tooltip'}]].concat(this.dailyAddRemovePoints().map(v => ([v.label, v.ideal, v.remove, v.tooltip, v.add, v.tooltip])))}
      options={{
        animation: {startup: true, duration: 100, easing: 'in'},
        hAxis: {viewWindow: {min: 0}, maxAlternation: 2},
        vAxis: {minValue: 0},
        legend: {position: 'top'},
        isStacked: true,
        interpolateNulls: true,
        series: {
          0: { type: 'line', color: 'orange', lineDashStyle: [4, 1], pointsVisible: false },
          1: { type: 'bars', color: 'red', isStacked: true },
          2: { type: 'bars', color: 'blue', isStacked: true },
        },
      }}
      />
    );
  }

  renderLine() {
    return (
      <Chart
        onClick={() => this.toggleColumnView()}
        chartType='LineChart'
        loader={<div>Loading Data ...</div>}
        data={[['Day', 'Ideal', 'Real', {role: 'tooltip'}, {role: 'certainty'}]].concat(this.dailyNetPoints().map(dp => ([dp.label, dp.ideal, dp.remaining, dp.tooltip, dp.certainty])))}
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
  }

  render() {
    return (
      <div onClick={() => this.toggleView()}>
        {this.state.style === ChartStyles.LINE ? this.renderLine() : this.renderColumn()}
      </div>
    );
  }
}
