import { Component } from 'react';
import { Container } from 'semantic-ui-react';
import { Switch, Route } from 'react-router-dom';
import ProjectList from './components/ProjectList';
import ProjectView from './views/ProjectView';
import NewSprintView from './views/NewSprintView';
import NewUserStoryView from './views/NewUserStoryView';

class App extends Component {
  state = {projects: [], project: null, view: 'project-list'};
  loadProjects() {
    this.setState({projects: [{id: 132, name: 'centrifuge'}]});
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
        <Switch>
          <Route exact path='/'>
            <ProjectList projects={this.state.projects} />
          </Route>
          <Route
            path='/project/:ProjectId'
            render={props => <ProjectView project={this.state.projects[props.match.params.ProjectId]} />}
          />
          <Route
            exact
            path='/project/:ProjectId/sprint'
            render={props => <NewSprintView project={this.state.projects[props.match.params.ProjectId]} />}
          />
          <Route
            exact
            path='/project/:ProjectId/story'
            render={props => <NewUserStoryView project={this.state.projects[props.match.params.ProjectId]} />}
          />
        </Switch>
      </Container>
    );
  }
}

export default App;
