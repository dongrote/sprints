import { Component } from 'react';
import { Button, Grid, Header, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import BurndownChart from '../components/BurndownChart';
import UserStoryColumn from '../components/UserStoryColumn';

class SprintView extends Component {
  state = {
    project: '',
    ProjectId: null,
    stories: [],
    predictedPoints: 0,
    completedPoints: 0,
    claimedPoints: 0,
    remainingPoints: 0,
    idealBurndown: [],
    realBurndown: [],
  };
  async remitUserStory(SprintId, UserStoryId) {
    const res = await fetch(`/api/sprints/${SprintId}/stories/${UserStoryId}`, {method: 'DELETE'});
    if (res.ok) {
      this.setState({stories: this.state.stories.filter(story => story.id !== UserStoryId)});
    }
  }
  async completeUserStory(SprintId, UserStoryId) {
    const res = await fetch(`/api/sprints/${SprintId}/complete`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({UserStoryId})
    });
    if (res.ok) {
      const updated = this.state.stories.map(story => {
        story.status = story.id === UserStoryId ? 'DONE' : story.status;
        return story;
      });
      this.setState({stories: updated});
    }
  }
  async loadSprint(SprintId) {
    const res = await fetch(`/api/sprints/${SprintId}`);
    if (res.ok) {
      const json = await res.json();
      this.setState({project: json.Project.name, ProjectId: json.ProjectId});
    }
  }
  async loadStories(SprintId) {
    const res = await fetch(`/api/sprints/${SprintId}/stories`);
    if (res.ok) {
      const json = await res.json();
      this.setState({stories: json.results});
    }
  }
  async loadBurndown(SprintId) {
    const res = await fetch(`/api/sprints/${SprintId}/burndown`);
    if (res.ok) {
      const json = await res.json();
      this.setState({idealBurndown: json.ideal, realBurndown: json.remaining});
    }
  }
  async componentDidMount() {
    await Promise.all([
      this.loadSprint(this.props.SprintId),
      this.loadStories(this.props.SprintId),
      this.loadBurndown(this.props.SprintId),
    ]);
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
          <Grid.Column textAlign='right'>
            <Link to={`/sprint/${this.props.SprintId}/claim`}>
              <Button
                color='orange'
                icon='plus'
                labelPosition='left'
                content='Claim User Story'
              />
            </Link>
            <Link to={`/project/${this.state.ProjectId}`}>
              <Button
                basic
                icon='briefcase'
                labelPosition='left'
                content='Back to Project'
              />
            </Link>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={1}>
          <Grid.Column>
            <BurndownChart ideal={this.state.idealBurndown} real={this.state.realBurndown} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={2}>
          <Grid.Column>
            <UserStoryColumn
              color='orange'
              header='Claimed'
              userStories={this.state.stories.filter(story => story.status === 'CLAIM')}
              onRemit={UserStoryId => this.remitUserStory(this.props.SprintId, UserStoryId)}
              onComplete={UserStoryId => this.completeUserStory(this.props.SprintId, UserStoryId)}
            />
          </Grid.Column>
          <Grid.Column>
            <UserStoryColumn
              color='blue'
              header='Done'
              userStories={this.state.stories.filter(story => story.status === 'DONE')}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default SprintView;