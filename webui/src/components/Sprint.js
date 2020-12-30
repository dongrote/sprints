import {Button, Card, Grid} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import PointStatistics from './PointStatistics';
import RelativeTime from 'dayjs/plugin/relativeTime';
import day from 'dayjs';
day.extend(RelativeTime);

const dateFormat = 'MMM D, YYYY';

const relativeMidSprintDate = (startAt, finishAt) => {
  const today = day().startOf('d'),
    startAtDay = day(startAt).startOf('d'),
    finishAtDay = day(finishAt).startOf('d'),
    sprintLengthInDays = finishAtDay.diff(startAtDay, 'd'),
    midSprintDate = startAtDay.add(Math.round(sprintLengthInDays / 2), 'd');
  if (today.isBefore(startAtDay) || today.isAfter(finishAtDay)) return '';
  if (midSprintDate.isSame(today, 'd')) return 'Mid-Sprint is today.';
  return midSprintDate.isBefore(today, 'd') ? `Mid-Sprint was ${midSprintDate.from(today)}.` : `Mid-Sprint is ${midSprintDate.to(today)}.`;
};

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
      <Card.Meta>
        {`${day(props.startDate).format(dateFormat)} - ${day(props.endDate).format(dateFormat)}`}
        <br />
        {relativeMidSprintDate(props.startDate, props.endDate)}
      </Card.Meta>
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
