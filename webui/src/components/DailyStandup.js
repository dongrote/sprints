import { Component } from 'react';
import { Link } from 'react-router-dom';
import {Button, Card, Image, List} from 'semantic-ui-react';
import MultilineText from './MultilineText';
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
          <Card.Meta>
            {dayjs(this.props.createdAt).format(dateFormat)}
            {this.props.edited && (<span title={dayjs(this.props.updatedAt).format('ddd, MMM D, YYYY h:mm a')} style={{'font-style': 'italic'}}> (edited)</span>)}
          </Card.Meta>
          <Card.Description>
            <List divided relaxed>
              <List.Item>
                <List.Icon name='history' />
                <List.Content>
                  <List.Header>What did I do yesterday?</List.Header>
                  <List.Description>
                    <MultilineText>{this.props.whatDidIDoYesterday}</MultilineText>
                  </List.Description>
                </List.Content>
              </List.Item>
              <List.Item>
                <List.Icon name='keyboard outline' />
                <List.Content>
                  <List.Header>What am I doing today?</List.Header>
                  <List.Description>
                    <MultilineText>{this.props.whatAmIDoingToday}</MultilineText>
                  </List.Description>
                </List.Content>
              </List.Item>
              <List.Item>
                <List.Icon name='shield' />
                <List.Content>
                  <List.Header>What is in my way?</List.Header>
                  <List.Description>
                    <MultilineText>{this.props.whatIsInMyWay}</MultilineText>
                  </List.Description>
                </List.Content>
              </List.Item>
            </List>
          </Card.Description>
        </Card.Content>
        <Card.Content extra>
          <Link to={`/sprint/${this.props.SprintId}/standups/${this.props.DailyStandupId}`}>
            <Button fluid icon='edit' content='Edit' />
          </Link>
        </Card.Content>
      </Card>
    );    
  }
}
