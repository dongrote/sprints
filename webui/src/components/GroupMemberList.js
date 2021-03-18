import { Component } from 'react';
import { Image, List } from 'semantic-ui-react';
import RoleLabel from './RoleLabel';

export default class GroupMemberList extends Component {
  state = {members: []};
  async fetchMembers() {
    const res = await fetch(`/api/groups/${this.props.GroupId}/members`);
    if (res.ok) this.setState({members: await res.json()});
  }
  async componentDidMount() {
    await this.fetchMembers();
  }
  render() {
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
