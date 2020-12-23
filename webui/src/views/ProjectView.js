import { Component } from 'react';
import {Button, Grid, Header, Icon} from 'semantic-ui-react';
import {Link} from 'react-router-dom';
import ProjectViewRow from '../components/ProjectViewRow';
import UserStoryColumn from '../components/UserStoryColumn';
import Sprint from '../components/Sprint';


class ProjectView extends Component {
  state = {project: null, userStories: [], sprints: []};
  async loadProject(ProjectId) {
    return new Promise(resolve => {
      setTimeout(() => resolve({id: ProjectId, name: 'centrifuge'}), 500);
    });
  }
  loadUserStories() {
    this.setState({
      userStories: [
        {name: 'Login', points: 3, status: 'READY'},
        {name: 'Logout', points: 1, status: 'DONE'},
        {name: 'Upload', points: 4, status: 'ALLOC'},
        {name: 'Progress', points: 8, status: 'ALLOC', description: 'Track analysis progress'},
        {name: 'Artifacts', points: 2, status: 'ALLOC', description: 'Find candidate artifacts for analysis'},
      ]
    })
  }
  loadSprints() {
    this.setState({
      sprints: [
        {name: 'fancy name', startAt: new Date(), finishAt: new Date(), allocated: 10, prediction: 10, completed: 4, remaining: 6},
        {name: 'other fancy name', startAt: new Date(), finishAt: new Date(), allocated: 8, prediction: 8, completed: 4, remaining: 4},
      ]
    });
  }
  async componentDidMount() {
    const project = await this.loadProject(this.props.ProjectId);
    this.loadUserStories();
    this.loadSprints();
    this.setState({project});
  }
  render() {
    if (!this.state.project) return null;
    return (
      <Grid columns={1}>
        <Grid.Row columns={2}>
          <Grid.Column>
            <Header as='h1' icon='briefcase' content={this.state.project.name} />
          </Grid.Column>
          <Grid.Column textAlign='right'>
            <Link to='/'>
              <Button basic>
                <Icon name='home' />
                Home
              </Button>
            </Link>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
          <ProjectViewRow
            icon='forward'
            title='Sprints'
            buttonColor='blue'
            buttonIcon='plus'
            buttonContent='New Sprint'
            buttonLinkTo={`/project/${this.props.ProjectId}/sprint`}
          >
            {this.state.sprints.map((sprint, i) => (
              <Sprint
                key={i}
                title={sprint.name}
                startDate={sprint.startAt}
                endDate={sprint.finishAt}
                allocatedPoints={sprint.allocated}
                predictedPoints={sprint.prediction}
                completedPoints={sprint.completed}
                remainingPoints={sprint.remaining}
              />
            ))}
          </ProjectViewRow>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
          <ProjectViewRow
            icon='tasks'
            title={`User Stories (${this.state.userStories.length})`}
            buttonColor='green'
            buttonIcon='plus'
            buttonContent='New User Story'
            buttonLinkTo={`/project/${this.props.ProjectId}/story`}
          >
            <Grid stackable columns={3}>
              <Grid.Row>
                <Grid.Column>
                  <UserStoryColumn
                    color='green'
                    header='Ready'
                    userStories={this.state.userStories.filter(s => s.status === 'READY')}
                    onPromote={story => alert(`promote ${story}`)}
                  />
                </Grid.Column>
                <Grid.Column>
                  <UserStoryColumn
                    color='orange'
                    header='Allocated'
                    userStories={this.state.userStories.filter(s => s.status === 'ALLOC')}
                    onDemote={story => alert(`demote ${story}`)}
                    onPromote={story => alert(`promote ${story}`)}
                  />
                </Grid.Column>
                <Grid.Column>
                  <UserStoryColumn
                    color='blue'
                    header='Done'
                    userStories={this.state.userStories.filter(s => s.status === 'DONE')}
                    onDemote={story => alert(`demote ${story}`)}
                  />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </ProjectViewRow>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default ProjectView;