import { Component } from 'react';
import {Card, Image, List} from 'semantic-ui-react';
import MultilineText from './MultilineText';
import EditDailyStandupForm from './EditDailyStandupForm';
import EditIconButton from './EditIconButton';
import dayjs from 'dayjs';

const dateFormat = 'ddd, MMM D, YYYY';

export default class DailyStandup extends Component {
  state = {
    firstName: '',
    lastName: '',
    avatarUrl: '',
    mutable: false,
    today: '',
    yesterday: '',
    blocking: '',
    createdAt: null,
    updatedAt: null,
    edited: false,
  };
  toggleMutable() {
    this.setState({mutable: !this.state.mutable});
  }
  async fetchUser(UserId) {
    const res = await fetch(`/api/users/${UserId}`);
    if (res.ok) {
      return await res.json();
    }
  }

  async fetchDailyStandup(DailyStandupId) {
    const res = await fetch(`/api/sprints/0/standups/${DailyStandupId}`);
    if (res.ok) {
      const json = await res.json();
      const user = await this.fetchUser(json.createdBy);
      json.User = user;
      return json;
    }
  }

  async refresh() {
    const standup = await this.fetchDailyStandup(this.props.DailyStandupId);
    if (standup) {
      console.log(standup);
      this.setState({
        firstName: standup.User.firstName,
        lastName: standup.User.lastName,
        avatarUrl: standup.User.avatarUrl,
        today: standup.whatAmIDoingToday,
        yesterday: standup.whatDidIDoYesterday,
        blocking: standup.whatIsInMyWay,
        createdAt: standup.createdAt,
        updatedAt: standup.updatedAt,
        edited: standup.createdAt !== standup.updatedAt,
      });
    }
  }

  async componentDidMount() {
    await this.refresh();
  }

  render() {
    return this.state.mutable ? this.renderMutable() : this.renderImmutable();
  }

  renderMutable() {
    return <EditDailyStandupForm
      DailyStandupId={this.props.DailyStandupId}
      onDismiss={() => this.toggleMutable()}
    />;
  }

  renderImmutable() {
    return (
      <Card fluid>
        <Card.Content>
          <EditIconButton floated='right' size='mini' onClick={() => this.toggleMutable()} />
          <Card.Header>
            {this.state.avatarUrl && <Image size='mini' src={this.state.avatarUrl} />}
            {this.state.firstName} {this.state.lastName}
          </Card.Header>
          <Card.Meta>
            {dayjs(this.state.createdAt).format(dateFormat)}
            {this.state.edited && (<span title={dayjs(this.state.updatedAt).format('ddd, MMM D, YYYY h:mm a')} style={{'font-style': 'italic'}}> (edited)</span>)}
          </Card.Meta>
          <Card.Description>
            <List divided relaxed>
              <List.Item>
                <List.Icon name='history' />
                <List.Content>
                  <List.Header>What did I do yesterday?</List.Header>
                  <List.Description>
                    <MultilineText>{this.state.yesterday}</MultilineText>
                  </List.Description>
                </List.Content>
              </List.Item>
              <List.Item>
                <List.Icon name='keyboard outline' />
                <List.Content>
                  <List.Header>What am I doing today?</List.Header>
                  <List.Description>
                    <MultilineText>{this.state.today}</MultilineText>
                  </List.Description>
                </List.Content>
              </List.Item>
              <List.Item>
                <List.Icon name='shield' />
                <List.Content>
                  <List.Header>What is in my way?</List.Header>
                  <List.Description>
                    <MultilineText>{this.state.blocking}</MultilineText>
                  </List.Description>
                </List.Content>
              </List.Item>
            </List>
          </Card.Description>
        </Card.Content>
      </Card>
    );    
  }

}
