import { Component } from 'react';
import { Container } from 'semantic-ui-react';
import ProjectList from './components/ProjectList';
import ProjectView from './views/ProjectView';

class App extends Component {
  state = {projects: [], project: null, view: 'project-list'};
  loadProjects() {
    this.setState({projects: ['centrifuge']});
  }
  selectProject(project) {
    this.setState({project, view: 'project-view'});
  }
  componentDidMount() {
    this.loadProjects();
  }
  render() {
    return (
      <Container>
        {this.state.view === 'project-list' &&
          <ProjectList
            projects={this.state.projects}
            onProjectSelect={project => this.selectProject(project)}
          />}
        {this.state.view === 'project-view' && <ProjectView project={this.state.project} />}
      </Container>
    );
  }
}

export default App;
