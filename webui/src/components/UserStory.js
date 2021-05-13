import { Button, Card, Grid } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import MultilineText from './MultilineText';
import StatusLabel from  './StatusLabel';

const UserStory = props => (
  <Card fluid={props.fluid}>
    <Card.Content>
      <Card.Header>
        <Grid columns={props.showEdit ? 2 : 1}>
          <Grid.Row>
            <Grid.Column>
              {props.title}
            </Grid.Column>
            {!props.editDisabled && (
              <Grid.Column textAlign='right' verticalAlign='middle'>
                <Link to={`/story/${props.UserStoryId}/edit`}>
                  <Button disabled compact basic size='mini' icon='edit' />
                </Link>
              </Grid.Column>
            )}
          </Grid.Row>
        </Grid>
      </Card.Header>
      {props.description && (
        <Card.Description>
          <MultilineText>{props.description}</MultilineText>
        </Card.Description>
      )}
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
            {!(props.onClaim || props.onRemit) && <StatusLabel status={props.completedAt ? 'DONE' : 'READY'} />}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Card.Content>
  </Card>
);

export default UserStory;
