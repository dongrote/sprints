import { Card, Grid } from 'semantic-ui-react';
import StatusLabel from  './StatusLabel';

const UserStory = props => (
  <Card>
    <Card.Content>
      <Card.Header>
        <Grid columns={2}>
          <Grid.Row>
            <Grid.Column>
              {props.title}
            </Grid.Column>
            <Grid.Column textAlign='right'>
              <StatusLabel status={props.status} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Card.Header>
      {props.description && <Card.Description content={props.description} />}
    </Card.Content>
    <Card.Content extra>
      {`${props.points} points`}
    </Card.Content>
  </Card>
);

export default UserStory;