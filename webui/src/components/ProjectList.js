import { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Table, Button, Header, Icon, Input } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

class ProjectList extends Component {
  state = {projects: [], unauth: false, newProjectName: '', createDisabled: true};
  async fetchProjects() {
    const res = await fetch(`/api/projects?GroupId=${this.props.GroupId}`);
    if (res.ok) {
      const json = await res.json();
      return json.results;
    }
    if (res.status === 401) this.setState({unauth: true});
    return [];
  }
  changeNewProjectName(name) {
    this.setState({newProjectName: name, createDisabled: name.length === 0});
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
        <Table.Row>
          <Table.Cell>
            <Input>
              <input
                size='40'
                placeholder='New Project Name'
                value={this.state.newProjectName}
                onChange={e => this.changeNewProjectName(e.target.value)}
              />
            </Input>
          </Table.Cell>
          <Table.Cell textAlign='right' verticalAlign='top'>
            <Button
              primary
              disabled={this.state.createDisabled}
              icon='plus square outline'
              content='Create New Project'
            />
          </Table.Cell>
        </Table.Row>
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
