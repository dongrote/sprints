import { Button, Card, Grid } from 'semantic-ui-react';
import StatusLabel from  './StatusLabel';

const UserStory = props => (
  <Card fluid={props.fluid}>
    <Card.Content>
      <Card.Header>
        <Grid columns={2}>
          <Grid.Row>
            <Grid.Column>
              {props.title}
            </Grid.Column>
            <Grid.Column textAlign='right'>
              <Button.Group>
                {props.onDemote && <Button basic icon='step backward' onClick={() => props.onDemote(props.title)} />}
                {props.onPromote && <Button basic icon='step forward' onClick={() => props.onPromote(props.title)} />}
              </Button.Group>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Card.Header>
      {props.description && <Card.Description content={props.description} />}
    </Card.Content>
    <Card.Content extra>
      <Grid columns={2}>
        <Grid.Row>
          <Grid.Column>
            {`${props.points} point${props.points === 1 ? '' : 's'}`}
          </Grid.Column>
          <Grid.Column textAlign='right'>
            <StatusLabel status={props.status} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Card.Content>
  </Card>
);

export default UserStory;