import { Component } from 'react';
import { Table, Button, Header, Icon, Input } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import GroupMemberList from '../components/GroupMemberList';

class GroupsView extends Component {
  state = {groups: [], newGroupName: '', createDisabled: true};
  async fetchGroups() {
    const res = await fetch('/api/groups');
    if (res.ok) {
      const json = await res.json();
      return json.results;
    }
    return [];
  }
  changeNewGroupName(name) {
    this.setState({newGroupName: name, createDisabled: name.length === 0});
  }
  async componentDidMount() {
    this.setState({groups: await this.fetchGroups()});
  }
  render() {
    return (
      <Table>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Groups</Table.HeaderCell>
          <Table.HeaderCell textAlign='right'>Actions</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell>
            <Input>
              <input
                size='40'
                placeholder='New Group Name'
                value={this.state.newGroupName}
                onChange={e => this.changeNewGroupName(e.target.value)}
              />
            </Input>
          </Table.Cell>
          <Table.Cell textAlign='right' verticalAlign='top'>
            <Button
              primary
              disabled={this.state.createDisabled}
              icon='plus square outline'
              content='Create New Group'
            />
          </Table.Cell>
        </Table.Row>
      {this.state.groups.map((group, i) => (
        <Table.Row key={i}>
          <Table.Cell>
            <Header as='h3'>
              <Icon name='users' />
              <Header.Content>{group.name}</Header.Content>
            </Header>
            <GroupMemberList GroupId={group.id} />
          </Table.Cell>
          <Table.Cell textAlign='right' verticalAlign='top'>
            <Button.Group compact>
              <Link to={`/groups/${group.id}/projects`}>
                <Button primary>
                  <Icon name='eye' />
                  View
                </Button>
              </Link>
              <Button negative icon='trash alternate' />
            </Button.Group>
          </Table.Cell>
        </Table.Row>
      ))}
      </Table.Body>
    </Table>  
    );
  }
}

export default GroupsView;
