import { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Button, Form, Header, Icon, Input } from 'semantic-ui-react';

class EditUserStoryView extends Component {
  state = {
    project: '',
    previousStory: '',
    story: '',
    previousPoints: 0,
    points: 0,
    previousDescription: '',
    description: '',
    redirect: false,
  };
  async loadStory(UserStoryId) {
    const res = await fetch(`/api/stories/${UserStoryId}`);
    if (res.ok) {
      const json = await res.json();
      this.setState({
        project: json.Project.name,
        ProjectId: json.ProjectId,
        previousStory: json.title,
        previousPoints: json.points,
        previousDescription: json.description,
        story: json.title,
        points: json.points,
        description: json.description,
      });
    }
  }
  onStoryChange(story) {
    this.setState({story});
  }
  onPointsChange(points) {
    const n = Number(points);
    if (isNaN(n)) return;
    if (n < 0) return;
    if (n > 100) return;
    this.setState({points: n});
  }
  onDescriptionChange(description) {
    this.setState({description});
  }
  async onUpdate() {
    const body = {};
    if (this.state.previousStory !== this.state.story) body.title = this.state.story;
    if (this.state.previousPoints !== this.state.points) body.points = this.state.points;
    if (this.state.previousDescription !== this.state.description) body.description = this.state.description;
    const res = await fetch(`/api/stories/${this.props.UserStoryId}`, {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(body)
    });
    if (res.ok) {
      this.setState({redirect: true});
    }
  }
  async componentDidMount() {
    await this.loadStory(this.props.UserStoryId);
  }
  render() {
    if (this.state.redirect) return <Redirect to={`/project/${this.state.ProjectId}`} />;
    return (
      <Form>
        <Header as='h1'>
          Update User Story for <Icon name='briefcase' /> {this.state.project}
        </Header>
        <Form.Group>
          <Form.Input label='Story' placeholder={this.state.previousStory} value={this.state.story} onChange={e => this.onStoryChange(e.target.value)} />
          <Form.Field>
            <label>Points</label>
            <Input>
              <input type='num' size='3' placeholder={this.state.previousPoints} value={this.state.points} onChange={e => this.onPointsChange(e.target.value)} />
            </Input>
          </Form.Field>
        </Form.Group>
        <Form.TextArea label='Description' placeholder={this.state.previousDescription || 'Optional description ...'} value={this.state.description} onChange={e => this.onDescriptionChange(e.target.value)} />
        <Form.Group>
          <Button primary disabled content='Update User Story' onClick={() => this.onUpdate()} />
          <Button content='Cancel' onClick={() => this.setState({redirect: true})} />
        </Form.Group>
      </Form>
    );
  }
}

export default EditUserStoryView;