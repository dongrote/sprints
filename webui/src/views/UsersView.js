import { Component } from 'react';
import { Table } from 'semantic-ui-react';
import UserTableRow from '../components/UserTableRow';

export default class UsersView extends Component {
  state = {users: []};

  async fetchUsers() {
    const res = await fetch('/api/users');
    if (res.ok) {
      const json = await res.json();
      this.setState({users: json.results});
    }
  }

  async componentDidMount() {
    await this.fetchUsers();
  }

  render() {
    return (
      <Table>
        <Table.Header>
          <Table.Cell>
            Name
          </Table.Cell>
          <Table.Cell>
            E-mail
          </Table.Cell>
          <Table.Cell textAlign='center'>
            System Role
          </Table.Cell>
          <Table.Cell textAlign='center'>
            Identity Provider
          </Table.Cell>
          <Table.Cell textAlign='center'>
            Groups
          </Table.Cell>
        </Table.Header>
        <Table.Body>
        {this.state.users.map((user, idx) => (
          <UserTableRow
            key={idx}
            UserId={user.id}
            name={user.displayName}
            email={user.email}
            avatarUrl={user.avatarUrl}
            identityProvider={user.identityProvider}
            systemRole={user.systemRole}
          />
        ))}
        </Table.Body>
      </Table>
    );
  }
}
