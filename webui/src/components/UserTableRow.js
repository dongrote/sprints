import { Component } from 'react';
import { Image, List, Table } from 'semantic-ui-react';
import IdentityProviderIcon from './IdentityProviderIcon';
import RoleLabel from './RoleLabel';

export default class UserTableRow extends Component {
  state = {groups: []};
  async fetchUserGroups() {
    const res = await fetch(`/api/users/${this.props.UserId}/groups`);
    if (res.ok) {
      const json = await res.json();
      this.setState({groups: json.map(g => ({name: g.name, role: g.role}))});
    }
  }
  async componentDidMount() {
    await this.fetchUserGroups();
  }
  render() {
    return (
      <Table.Row>
        <Table.Cell verticalAlign='middle'>
          {this.props.avatarUrl && <Image avatar src={this.props.avatarUrl} />}
          {this.props.name}
        </Table.Cell>
        <Table.Cell verticalAlign='middle'>
          <a href={`mailto:${this.props.email}`}>{this.props.email}</a>
        </Table.Cell>
        <Table.Cell textAlign='center' verticalAlign='middle'>
          <RoleLabel role={this.props.systemRole} />
        </Table.Cell>
        <Table.Cell textAlign='center' verticalAlign='middle'>
          <IdentityProviderIcon provider={this.props.identityProvider} />
        </Table.Cell>
        <Table.Cell>
          <List divided>
            {this.state.groups.map((group, idx) => (
              <List.Item key={idx}>
                <List.Icon name='users' size='large' verticalAlign='middle' />
                <List.Content>
                  <List.Header content={group.name} />
                  <List.Description><RoleLabel role={group.role} /></List.Description>
                </List.Content>
              </List.Item>
            ))}
          </List>
        </Table.Cell>
    </Table.Row>
);
  }
}
