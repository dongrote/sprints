import { Component } from 'react';
import {Button, Grid, Header, Icon} from 'semantic-ui-react';
import {Link} from 'react-router-dom';
import ProjectViewRow from '../components/ProjectViewRow';
import UserStoryColumn from '../components/UserStoryColumn';
import Sprint from '../components/Sprint';
import VelocityChart from '../components/VelocityChart';


class ProjectView extends Component {
  state = {project: null, userStories: [], sprints: [], velocity: []};
  async loadProject(ProjectId) {
    const res = await fetch(`/api/projects/${ProjectId}`);
    if (res.ok) {
      const json = await res.json();
      this.setState({project: json});
    }
  }
  async loadUserStories(ProjectId) {
    const res = await fetch(`/api/projects/${ProjectId}/stories`);
    if (res.ok) {
      const json = await res.json();
      this.setState({userStories: json.results});
    }
  }
  async loadSprints(ProjectId) {
    const res = await fetch(`/api/projects/${ProjectId}/sprints`);
    if (res.ok) {
      const json = await res.json();
      this.setState({sprints: json.results});
    }
  }
  async loadVelocityValues(ProjectId) {
    const res = await fetch(`/api/projects/${ProjectId}/velocity`);
    if (res.ok) {
      const json = await res.json();
      this.setState({velocity: json});
    }
  }
  async componentDidMount() {
    await Promise.all([
      this.loadProject(this.props.ProjectId),
      this.loadSprints(this.props.ProjectId),
      this.loadUserStories(this.props.ProjectId),
      this.loadVelocityValues(this.props.ProjectId),
    ]);
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
        <Grid.Row columns={1}>
          <Grid.Column>
            <VelocityChart velocities={this.state.velocity} />
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
            buttonLinkTo={`/project/${this.props.ProjectId}/sprints`}
          >
            {this.state.sprints.map((sprint, i) => (
              <Link key={i} to={`/sprint/${sprint.id}`}>
              <Sprint
                key={i}
                SprintId={sprint.id}
                title={sprint.title}
                startDate={sprint.startAt}
                endDate={sprint.finishAt}
                claimedPoints={sprint.claimedPoints}
                predictedPoints={sprint.predictedPoints}
                completedPoints={sprint.completedPoints}
                remainingPoints={sprint.claimedPoints - sprint.completedPoints}
              />
              </Link>
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
            buttonLinkTo={`/project/${this.props.ProjectId}/stories`}
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
                    header='Claimed'
                    userStories={this.state.userStories.filter(s => s.status === 'CLAIM')}
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