import { Component } from 'react';
import { Container, Grid } from 'semantic-ui-react';
import { Switch, Route } from 'react-router-dom';
import ProjectList from './components/ProjectList';
import ProjectView from './views/ProjectView';
import SprintView from './views/SprintView';
import NewSprintView from './views/NewSprintView';
import NewUserStoryView from './views/NewUserStoryView';
import ClaimUserStoryView from './views/ClaimUserStoryView';
import EditSprintView from './views/EditSprintView';
import EditUserStoryView from './views/EditUserStoryView';
import SignInView from './views/SignInView';
import GroupsView from './views/GroupsView';
import NavigationHeader from './components/NavigationHeader';

const WithNavigationHeader = props => (
  <Grid columns={1}>
    <Grid.Row>
      <Grid.Column>
        <NavigationHeader />
      </Grid.Column>
    </Grid.Row>
    <Grid.Row>
      <Grid.Column>
        {props.children}
      </Grid.Column>
    </Grid.Row>
  </Grid>
);

class App extends Component {
  render() {
    return (
      <Container style={{'margin-top': '0.5em'}}>
        <Switch>
          <Route exact path='/'>
            <SignInView />
          </Route>
          <Route exact path='/groups'>
            <WithNavigationHeader>
              <GroupsView />
            </WithNavigationHeader>
          </Route>
          <Route
            exact
            path='/groups/:GroupId/projects'
            render={props => (
              <WithNavigationHeader>
                <ProjectList GroupId={props.match.params.GroupId} />
              </WithNavigationHeader>
            )}
          />
          <Route
            exact
            path='/project/:ProjectId/sprints'
            render={props => (
              <WithNavigationHeader>
                <NewSprintView ProjectId={props.match.params.ProjectId} />
              </WithNavigationHeader>
            )}
          />
          <Route
            exact
            path='/project/:ProjectId/stories'
            render={props => (
              <WithNavigationHeader>
                <NewUserStoryView ProjectId={props.match.params.ProjectId} />
              </WithNavigationHeader>
            )}
          />
          <Route
            path='/project/:ProjectId'
            render={props => (
              <WithNavigationHeader>
                <ProjectView ProjectId={props.match.params.ProjectId} />
              </WithNavigationHeader>
            )}
          />
          <Route
            exact
            path='/sprint/:SprintId/claim'
            render={props => (
              <WithNavigationHeader>
                <ClaimUserStoryView SprintId={props.match.params.SprintId} />
              </WithNavigationHeader>
            )}
          />
          <Route
            exact
            path='/sprint/:SprintId/edit'
            render={props => (
              <WithNavigationHeader>
                <EditSprintView SprintId={props.match.params.SprintId} />
              </WithNavigationHeader>
            )}
          />
          <Route
            path='/sprint/:SprintId'
            render={props => (
              <WithNavigationHeader>
                <SprintView SprintId={props.match.params.SprintId} />
              </WithNavigationHeader>
            )}
          />
          <Route
            path='/story/:UserStoryId/edit'
            render={props => (
              <WithNavigationHeader>
                <EditUserStoryView UserStoryId={props.match.params.UserStoryId} />
              </WithNavigationHeader>
            )}
          />
        </Switch>
      </Container>
    );
  }
}

export default App;
