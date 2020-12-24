import { Button, Card, Grid } from 'semantic-ui-react';
import StatusLabel from  './StatusLabel';

const UserStory = props => (
  <Card fluid={props.fluid}>
    <Card.Content>
      <Card.Header>
        {props.title}
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
            <Button.Group compact size='small'>
              {props.onClaim && <Button color='orange' content='Claim' onClick={() => props.onClaim(props.UserStoryId)} />}
              {props.onRemit && <Button color='red' content='Remit' onClick={() => props.onRemit(props.UserStoryId)} />}
              {props.onComplete && <Button color='blue' content='Complete' onClick={() => props.onComplete(props.UserStoryId)} />}
            </Button.Group>
            {!(props.onClaim || props.onRemit) && <StatusLabel status={props.status} />}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Card.Content>
  </Card>
);

export default UserStory;