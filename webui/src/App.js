import { Component } from 'react';
import { Container } from 'semantic-ui-react';
import { Switch, Route } from 'react-router-dom';
import ProjectList from './components/ProjectList';
import ProjectView from './views/ProjectView';
import SprintView from './views/SprintView';
import NewSprintView from './views/NewSprintView';
import NewUserStoryView from './views/NewUserStoryView';
import ClaimUserStoryView from './views/ClaimUserStoryView';

class App extends Component {
  render() {
    return (
      <Container>
        <Switch>
          <Route exact path='/'>
            <ProjectList />
          </Route>
          <Route
            exact
            path='/project/:ProjectId/sprints'
            render={props => <NewSprintView ProjectId={props.match.params.ProjectId} />}
          />
          <Route
            exact
            path='/project/:ProjectId/stories'
            render={props => <NewUserStoryView ProjectId={props.match.params.ProjectId} />}
          />
          <Route
            path='/project/:ProjectId'
            render={props => <ProjectView ProjectId={props.match.params.ProjectId} />}
          />
          <Route
            exact
            path='/sprint/:SprintId/claim'
            render={props => <ClaimUserStoryView SprintId={props.match.params.SprintId} />}
          />
          <Route
            path='/sprint/:SprintId'
            render={props => <SprintView SprintId={props.match.params.SprintId} />}
          />
        </Switch>
      </Container>
    );
  }
}

export default App;
