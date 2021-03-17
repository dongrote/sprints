import { Component } from 'react';
import { Table, Button, Header, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

class GroupsView extends Component {
  state = {groups: []};
  async fetchGroups() {
    const res = await fetch('/api/groups');
    if (res.ok) {
      const json = await res.json();
      return json.results;
    }
    return [];
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
      {this.state.groups.map((group, i) => (
        <Table.Row key={i}>
          <Table.Cell>
            <Header as='h3'>
              <Icon name='users' />
              <Header.Content>{group.name}</Header.Content>
            </Header>
          </Table.Cell>
          <Table.Cell textAlign='right'>
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
