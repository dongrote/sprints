import { Grid, Statistic } from 'semantic-ui-react';

const PointStatistics = props => (
  <Grid columns={1}>
    <Grid.Row only='mobile'>
      <Grid.Column>
        <Statistic.Group horizontal>
          <Statistic text label='predicted' value={props.predicted} />
          <Statistic text label='allocated' value={props.allocated} />
          <Statistic text label='completed' value={props.completed} />
          <Statistic text label='remaining' value={props.remaining} />
        </Statistic.Group>
      </Grid.Column>
    </Grid.Row>
    <Grid.Row only='tablet computer'>
      <Grid.Column>
        <Statistic.Group>
          <Statistic label='predicted' value={props.predicted} />
          <Statistic label='allocated' value={props.allocated} />
          <Statistic label='completed' value={props.completed} />
          <Statistic label='remaining' value={props.remaining} />
        </Statistic.Group>
      </Grid.Column>
    </Grid.Row>
  </Grid>
);

export default PointStatistics;