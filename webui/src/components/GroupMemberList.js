import { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Image, List } from 'semantic-ui-react';
import RoleLabel from './RoleLabel';

export default class GroupMemberList extends Component {
  state = {members: [], unauth: false};
  async fetchMembers() {
    const res = await fetch(`/api/groups/${this.props.GroupId}/members`);
    if (res.ok) this.setState({members: await res.json()});
    if (res.status === 401) this.setState({unauth: true});
  }
  async componentDidMount() {
    await this.fetchMembers();
  }
  render() {
    if (this.state.unauth) return <Redirect to='/' />;
    return (
      <List>
        {this.state.members.map((member, idx) => (
          <List.Item key={idx}>
            <Image avatar src={member.avatarUrl} />
            <List.Content>
              <List.Header>{member.displayName}</List.Header>
              <List.Description>
                <RoleLabel role={member.role} />
              </List.Description>
            </List.Content>
          </List.Item>
        ))}
      </List>
    );
  }
}
