import { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, List } from 'semantic-ui-react';
import DailyStandup from './DailyStandup';

export default class DailyStandupFeed extends Component {
  state = {standups: []};

  async fetchDailyStandups(SprintId) {
    const res = await fetch(`/api/sprints/${SprintId}/standups`);
    if (res.ok) {
      const {results} = await res.json();
      this.setState({standups: results});
    }
  }

  async componentDidMount() {
    await this.fetchDailyStandups(this.props.SprintId);
  }

  render() {
    return (
      <List>
        <List.Header>Daily Standups</List.Header>
        <List.Item>
          <Link to={`/sprint/${this.props.SprintId}/create-standup`}>
            <Button fluid primary content='New Standup' />
          </Link>
        </List.Item>
        {this.state.standups.map((standup, i) => (
          <List.Item key={i}>
            <DailyStandup
              createdBy={standup.createdBy}
              createdAt={standup.createdAt}
              whatDidIDoYesterday={standup.whatDidIDoYesterday}
              whatAmIDoingToday={standup.whatAmIDoingToday}
              whatIsInMyWay={standup.whatIsInMyWay}
            />
          </List.Item>
        ))}
      </List>
    );
  }
}
