import { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Button, Form, Header, Icon, Input } from 'semantic-ui-react';

const exampleStories = [
  'File upload',
  'User login',
  'User logout',
  'Update profile',
];

const randomExampleStory = () => exampleStories[Math.floor(Math.random() * exampleStories.length)];

class NewUserStoryView extends Component {
  state = {project: '', story: '', points: 0, description: '', redirect: false, exampleStory: randomExampleStory()};
  async fetchProjectName(ProjectId) {
    const res = await fetch(`/api/projects/${ProjectId}`);
    if (res.ok) {
      const json = await res.json();
      this.setState({project: json.name});
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
  async onCreate() {
    const body = {
      ProjectId: this.props.ProjectId,
      title: this.state.story,
      points: this.state.points,
    };
    if (this.state.description) body.description = this.state.description;
    const res = await fetch(`/api/stories`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(body)
    });
    if (res.ok) {
      this.setState({redirect: true});
    }
  }
  async componentDidMount() {
    await this.fetchProjectName(this.props.ProjectId);
  }
  render() {
    if (this.state.redirect) return <Redirect to={`/project/${this.props.ProjectId}`} />;
    return (
      <Form>
        <Header as='h1'>
          Create a New User Story for <Icon name='briefcase' /> {this.state.project}
        </Header>
        <Form.Group>
          <Form.Input label='Story' placeholder={this.state.exampleStory} value={this.state.story} onChange={e => this.onStoryChange(e.target.value)} />
          <Form.Field>
            <label>Points</label>
            <Input>
              <input type='num' size='3' placeholder='0' value={this.state.points} onChange={e => this.onPointsChange(e.target.value)} />
            </Input>
          </Form.Field>
        </Form.Group>
        <Form.TextArea label='Description' placeholder='Optional description ...' value={this.state.description} onChange={e => this.onDescriptionChange(e.target.value)} />
        <Form.Group>
          <Button primary content='Create User Story' onClick={() => this.onCreate()} />
          <Button content='Cancel' onClick={() => this.setState({redirect: true})} />
        </Form.Group>
      </Form>
    );
  }
}

export default NewUserStoryView;
