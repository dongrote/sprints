import { Statistic } from 'semantic-ui-react';

const PointStatistics = props => (
  <Statistic.Group>
    <Statistic label='predicted' value={props.predicted} />
    <Statistic label='allocated' value={props.allocated} />
    <Statistic label='completed' value={props.completed} />
    <Statistic label='remaining' value={props.remaining} />
  </Statistic.Group>
);

export default PointStatistics;