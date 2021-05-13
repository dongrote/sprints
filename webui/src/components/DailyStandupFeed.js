import { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Header, List } from 'semantic-ui-react';
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
        <List.Header>
          <Header content='Daily Standups' />
        </List.Header>
        {this.state.standups.map((standup, i) => (
          <List.Item key={i}>
            <DailyStandup DailyStandupId={standup.DailyStandupId} />
          </List.Item>
        ))}
        <List.Item>
          <Link to={`/sprint/${this.props.SprintId}/create-standup`}>
            <Button fluid primary icon='file alternate' content='New Standup' />
          </Link>
        </List.Item>
      </List>
    );
  }
}
