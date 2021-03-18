import { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Table, Button, Header, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

class ProjectList extends Component {
  state = {projects: [], unauth: false};
  async fetchProjects() {
    const res = await fetch(`/api/projects?GroupId=${this.props.GroupId}`);
    if (res.ok) {
      const json = await res.json();
      return json.results;
    }
    if (res.status === 401) this.setState({unauth: true});
    return [];
  }
  async componentDidMount() {
    this.setState({projects: await this.fetchProjects()});
  }
  render() {
    if (this.state.unauth) return <Redirect to='/' />
    return (
      <Table>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Projects</Table.HeaderCell>
          <Table.HeaderCell textAlign='right'>Actions</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
      {this.state.projects.map((project, i) => (
        <Table.Row key={i}>
          <Table.Cell>
            <Header as='h3'>
              <Icon name='briefcase' />
              <Header.Content>{project.name}</Header.Content>
            </Header>
          </Table.Cell>
          <Table.Cell textAlign='right'>
            <Button.Group compact>
              <Link to={`/project/${project.id}`}>
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

export default ProjectList;
