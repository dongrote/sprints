import { Component } from 'react';
import {Card, Image, List} from 'semantic-ui-react';
import dayjs from 'dayjs';

const dateFormat = 'ddd, MMM D, YYYY';

export default class DailyStandup extends Component {
  state = {firstName: '', lastName: '', avatarUrl: ''};
  async fetchUser(UserId) {
    const res = await fetch(`/api/users/${UserId}`);
    if (res.ok) {
      const json = await res.json();
      this.setState({firstName: json.firstName, lastName: json.lastName, avatarUrl: json.avatarUrl});
    }
  }
  async componentDidMount() {
    await this.fetchUser(this.props.createdBy);
  }
  render() {
    return (
      <Card fluid>
        <Card.Content>
          {this.state.avatarUrl && <Image
            floated='right'
            size='mini'
            src={this.state.avatarUrl}
          />}
          <Card.Header>{this.state.firstName} {this.state.lastName}</Card.Header>
          <Card.Meta>{dayjs(this.props.createdAt).format(dateFormat)}</Card.Meta>
          <Card.Description>
            <List divided relaxed>
              <List.Item>
                <List.Icon name='history' />
                <List.Content>
                  <List.Header>What did I do yesterday?</List.Header>
                  <List.Description>{this.props.whatDidIDoYesterday}</List.Description>
                </List.Content>
              </List.Item>
              <List.Item>
                <List.Icon name='keyboard outline' />
                <List.Content>
                  <List.Header>What am I doing today?</List.Header>
                  <List.Description>{this.props.whatAmIDoingToday}</List.Description>
                </List.Content>
              </List.Item>
              <List.Item>
                <List.Icon name='shield' />
                <List.Content>
                  <List.Header>What is in my way?</List.Header>
                  <List.Description>{this.props.whatIsInMyWay}</List.Description>
                </List.Content>
              </List.Item>
            </List>
          </Card.Description>
        </Card.Content>
      </Card>
    );    
  }
}
