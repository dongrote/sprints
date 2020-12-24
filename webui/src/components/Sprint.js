import {Button, Card, Grid} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import PointStatistics from './PointStatistics';
import day from 'dayjs';

const dateFormat = 'MMM D, YYYY';

const Sprint = props => (
  <Card fluid>
    <Card.Content>
      <Card.Header>
        <Grid columns={2}>
          <Grid.Row>
            <Grid.Column>{props.title}</Grid.Column>
            <Grid.Column textAlign='right'>
              <Button.Group>
                <Link to={`/sprint/${props.SprintId}/edit`}>
                  <Button basic icon='edit outline' />
                </Link>
                <Button basic icon='chart line' />
                <Button basic icon='ellipsis horizontal' />
              </Button.Group>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Card.Header>
      <Card.Meta content={`${day(props.startDate).format(dateFormat)} - ${day(props.endDate).format(dateFormat)}`} />
    </Card.Content>
    <Card.Content extra>
      <PointStatistics
        predicted={props.predictedPoints}
        allocated={props.claimedPoints}
        completed={props.completedPoints}
        remaining={props.remainingPoints}
      />
    </Card.Content>
    {props.description && <Card.Content extra>
      <pre>{props.description}</pre>
    </Card.Content>}
  </Card>
);

export default Sprint;