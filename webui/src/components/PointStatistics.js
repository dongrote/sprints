import { Grid, Statistic } from 'semantic-ui-react';

const PointStatistics = props => (
  <Grid columns={1}>
    <Grid.Row only='mobile'>
      <Grid.Column>
        <Grid columns={2}>
          <Grid.Row>
            <Grid.Column>
              <Statistic text horizontal label='predicted' value={props.predicted || 0} />
            </Grid.Column>
            <Grid.Column>
              <Statistic text horizontal label='completed' value={props.completed || 0} />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Statistic text horizontal label='claimed' value={props.allocated || 0} />
            </Grid.Column>
            <Grid.Column>
              <Statistic text horizontal label='remaining' value={props.remaining || 0} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Grid.Column>
    </Grid.Row>
    <Grid.Row only='tablet computer'>
      <Grid.Column>
        <Statistic.Group>
          <Statistic label='predicted' value={props.predicted || 0} />
          <Statistic label='claimed' value={props.allocated || 0} />
          <Statistic label='completed' value={props.completed || 0} />
          <Statistic label='remaining' value={props.remaining || 0} />
        </Statistic.Group>
      </Grid.Column>
    </Grid.Row>
  </Grid>
);

export default PointStatistics;
