import { Grid } from 'semantic-ui-react';

const StackableSideBySide = props => (
  <Grid stackable columns={2}>
    <Grid.Row>
      <Grid.Column>
        {props.left}
      </Grid.Column>
      <Grid.Column>
        {props.right}
      </Grid.Column>
    </Grid.Row>
  </Grid>
);

export default StackableSideBySide;
