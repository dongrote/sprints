import { Component } from 'react';
import { Button, Grid, Header, Icon } from 'semantic-ui-react';
import { Link, Redirect } from 'react-router-dom';
import UserStoryColumn from '../components/UserStoryColumn';

class ClaimUserStoryView extends Component {
  state = {available: [], redirect: false};
  async claimStory(UserStoryId) {
    await fetch(`/api/sprints/${this.props.SprintId}/claim`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({UserStoryId})
    });
    this.goBack();
  }
  async loadAvailableStories(SprintId) {
    const res = await fetch(`/api/sprints/${SprintId}/available`);
    if (res.ok) {
      const json = await res.json();
      this.setState({available: json.results});
    }
  }
  async componentDidMount() {
    await this.loadAvailableStories(this.props.SprintId);
  }
  goBack() {
    this.setState({redirect: true});
  }
  render() {
    if (this.state.redirect) return <Redirect to={`/sprint/${this.props.SprintId}`} />;
    return (
      <Grid columns={1}>
        <Grid.Row columns={2}>
          <Grid.Column>
            <Header as='h1'>
              <Icon name='forward' />
              <Header.Content>Claim User Story for Sprint</Header.Content>
            </Header>
          </Grid.Column>
          <Grid.Column textAlign='right'>
            <Link to={`/sprint/${this.props.SprintId}`}>
              <Button
                basic
                icon='arrow left'
                labelPosition='left'
                content='Back'
                onClick={() => this.goBack()}
              />
            </Link>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <UserStoryColumn
              color='green'
              header='Available User Stories'
              userStories={this.state.available}
              onClaim={UserStoryId => this.claimStory(UserStoryId)}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default ClaimUserStoryView;