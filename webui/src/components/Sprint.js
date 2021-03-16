import { Component } from 'react';
import {Button, Card, Grid} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import BurndownSparkline from './BurndownSparkline';
import PointStatistics from './PointStatistics';
import RelativeTime from 'dayjs/plugin/relativeTime';
import day from 'dayjs';
day.extend(RelativeTime);

const dateFormat = 'MMM D, YYYY';

const countdownString = (startAt, finishAt) => {
  const today = day().startOf('d'),
    startAtDay = day(startAt).startOf('d'),
    finishAtDay = day(finishAt).startOf('d'),
    sprintLengthInDays = finishAtDay.diff(startAtDay, 'd'),
    midSprintDate = startAtDay.add(Math.round(sprintLengthInDays / 2), 'd');
  if (today.isBefore(startAtDay) || today.isAfter(finishAtDay)) return '';
  if (midSprintDate.isSame(today, 'd')) return 'Mid-Sprint is today.';
  return (midSprintDate.isBefore(today, 'd')) ? `End of sprint ${finishAtDay.add(1, 'd').from(today)}.` : `Mid-Sprint ${midSprintDate.from(today)}.`;
};

class Sprint extends Component {
  state = {burndownValues: [], countdownString: ''};
  async refreshBurndownSparkline() {
    const res = await fetch(`/api/sprints/${this.props.SprintId}/burndown`);
    if (res.ok) {
      const {realValues: {net: burndownValues}} = await res.json();
      this.setState({burndownValues});
    }
  }
  refreshRelativeCountdown() {
    this.setState({countdownString: countdownString(this.props.startDate, this.props.endDate)});
    setTimeout(() => this.refreshRelativeCountdown(), 3600000);
  }
  async componentDidMount() {
    this.refreshRelativeCountdown();
    await this.refreshBurndownSparkline();
  }
  render() {
    return (
      <Card fluid>
        <Card.Content>
          <Card.Header>
            <Grid columns={2}>
              <Grid.Row>
                <Grid.Column>{this.props.title}</Grid.Column>
                <Grid.Column textAlign='right'>
                  <Button.Group>
                    <Link to={`/sprint/${this.props.SprintId}/edit`}>
                      <Button basic icon='edit outline' />
                    </Link>
                  </Button.Group>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Card.Header>
          <Card.Meta>
            {`${day(this.props.startDate).format(dateFormat)} - ${day(this.props.endDate).format(dateFormat)}`}
            {this.state.countdownString && <br />}
            {this.state.countdownString}
          </Card.Meta>
        </Card.Content>
        <Card.Content extra>
          <Grid>
            <Grid.Row only='tablet computer' columns={2}>
              <Grid.Column width={12}>
                <PointStatistics
                  predicted={this.props.predictedPoints}
                  allocated={this.props.claimedPoints}
                  completed={this.props.completedPoints}
                  remaining={this.props.remainingPoints}
                />
              </Grid.Column>
              <Grid.Column verticalAlign='middle' width={4}>
                <BurndownSparkline
                  values={this.state.burndownValues}
                  max={this.props.claimedPoints}
                />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row only='mobile' columns={1}>
              <Grid.Column>
                <PointStatistics
                  predicted={this.props.predictedPoints}
                  allocated={this.props.claimedPoints}
                  completed={this.props.completedPoints}
                  remaining={this.props.remainingPoints}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Card.Content>
        {this.props.description && <Card.Content extra>
          <pre>{this.props.description}</pre>
        </Card.Content>}
      </Card>
    );
  }
}

export default Sprint;
