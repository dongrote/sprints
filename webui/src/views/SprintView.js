import { Component } from 'react';
import { Button, Grid, Header, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import Sprint from '../components/Sprint';
import SprintFeed from '../components/SprintFeed';
import BurndownChart from '../components/BurndownChart';
import UserStoryColumn from '../components/UserStoryColumn';
import NewStoryButton from '../components/NewStoryButton';
import ClaimStoryButton from '../components/ClaimStoryButton';

class SprintView extends Component {
  state = {
    sprintLoaded: false,
    project: '',
    ProjectId: null,
    sprint: '',
    description: '',
    start: null,
    finish: null,
    stories: [],
    predictedPoints: 0,
    completedPoints: 0,
    claimedPoints: 0,
    remainingPoints: 0,
    burndownLabels: [],
    burndownIdealValues: [],
    burndownRealNetValues: [],
    burndownRealIncrementValues: [],
    burndownRealDecrementValues: [],
    idealBurndown: [],
    realBurndown: [],
  };
  async remitUserStory(SprintId, UserStoryId) {
    const res = await fetch(`/api/sprints/${SprintId}/transactions`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({StoryId: UserStoryId, action: 'UNCLAIM'}),
    });
    if (res.ok) await this.refreshView();
  }
  async completeUserStory(SprintId, UserStoryId) {
    const res = await fetch(`/api/sprints/${SprintId}/transactions`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({StoryId: UserStoryId, action: 'COMPLETE'}),
    });
    if (res.ok) await this.refreshView();
  }
  async loadSprint(SprintId) {
    const res = await fetch(`/api/sprints/${SprintId}`);
    if (res.ok) {
      const json = await res.json();
      this.setState({
        // project: json.Project.name,
        ProjectId: json.ProjectId,
        sprint: json.name,
        start: json.startAt,
        finish: json.endAt,
        predictedPoints: json.points.predicted,
        completedPoints: json.points.completed,
        claimedPoints: json.points.claimed,
        remainingPoints: json.points.remaining,
        description: json.description,
        sprintLoaded: true,
      });
    }
  }
  async loadStories(SprintId) {
    const res = await fetch(`/api/stories?SprintId=${SprintId}`);
    if (res.ok) {
      this.setState({stories: await res.json()});
    }
  }
  async loadBurndown(SprintId) {
    const res = await fetch(`/api/sprints/${SprintId}/burndown`);
    if (res.ok) {
      const json = await res.json();
      this.setState({
        burndownLabels: json.labels,
        burndownIdealValues: json.idealValues,
        burndownRealNetValues: json.realValues.net,
        burndownRealIncrementValues: json.realValues.inc,
        burndownRealDecrementValues: json.realValues.dec,
      });
    }
  }
  async refreshView() {
    await this.loadSprint(this.props.SprintId);
    await Promise.all([
      this.loadStories(this.props.SprintId),
      this.loadBurndown(this.props.SprintId),
    ]);
  }
  async componentDidMount() {
    await this.refreshView();
  }
  render() {
    return (
      <Grid columns={1}>
        <Grid.Row columns={2}>
          <Grid.Column>
            <Header as='h1'>
              <Icon name='briefcase' />
              <Header.Content>{this.state.project}</Header.Content>
            </Header>
          </Grid.Column>
          <Grid.Column textAlign='right' verticalAlign='middle'>
            <Grid columns={1}>
              <Grid.Row only='mobile'>
                <Grid.Column>
                  <Link to={`/project/${this.state.ProjectId}`}>
                    <Button
                      basic
                      size='mini'
                      icon='left arrow'
                      labelPosition='left'
                      content='Back'
                    />
                  </Link>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row only='tablet computer'>
                <Grid.Column>
                  <Link to={`/project/${this.state.ProjectId}`}>
                    <Button
                      basic
                      icon='left arrow'
                      labelPosition='left'
                      content='Back to Project'
                    />
                  </Link>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Header as='h2'>
              <Icon name='forward'/>
              <Header.Content>{this.state.sprint}</Header.Content>
            </Header>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={1}>
          <Grid.Column>
            {this.state.sprintLoaded && <Sprint
              SprintId={this.props.SprintId}
              title={this.state.sprint}
              startDate={this.state.start}
              endDate={this.state.finish}
              claimedPoints={this.state.claimedPoints}
              predictedPoints={this.state.predictedPoints}
              completedPoints={this.state.completedPoints}
              remainingPoints={this.state.remainingPoints}
              description={this.state.description}
            />}
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={1}>
          <Grid.Column>
            <BurndownChart
              labels={this.state.burndownLabels}
              ideals={this.state.burndownIdealValues}
              net={this.state.burndownRealNetValues}
              inc={this.state.burndownRealIncrementValues}
              dec={this.state.burndownRealDecrementValues}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row divided columns={2}>
          <Grid.Column textAlign='right'>
            <NewStoryButton ProjectId={this.state.ProjectId} />
          </Grid.Column>
          <Grid.Column>
            <ClaimStoryButton SprintId={this.props.SprintId} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={1}>
          <Grid.Column>
            <Grid stackable columns={2}>
              <Grid.Row>
                <Grid.Column>
                  <UserStoryColumn
                    color='orange'
                    header='Claimed'
                    userStories={this.state.stories.filter(story => story.completedAt === null)}
                    onRemit={UserStoryId => this.remitUserStory(this.props.SprintId, UserStoryId)}
                    onComplete={UserStoryId => this.completeUserStory(this.props.SprintId, UserStoryId)}
                  />
                </Grid.Column>
                <Grid.Column>
                  <UserStoryColumn
                    color='blue'
                    header='Done'
                    userStories={this.state.stories.filter(story => story.completedAt !== null)}
                  />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={1}>
          <Grid.Column>
            <SprintFeed SprintId={this.props.SprintId} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default SprintView;
