import { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Button, Form, Header, Icon, Input } from 'semantic-ui-react';

class NewSprintView extends Component {
  state = {project: '', name: '', points: 0, description: '', start: null, finish: null, redirect: false};
  async fetchProjectName(ProjectId) {
    const res = await fetch(`/api/projects/${ProjectId}`);
    if (res.ok) {
      const json = await res.json();
      this.setState({project: json.name});
    }
  }
  onNameChange(name) {
    this.setState({name});
  }
  onPointsChange(points) {
    const n = Number(points);
    if (isNaN(n)) return;
    if (n < 0) return;
    if (n > 100) return;
    this.setState({points: n});
  }
  onStartChange(startAt) {
    this.setState({start: `${startAt.split('T')[0]}T00:00`});
  }
  onFinishChange(finishAt) {
    this.setState({finish: `${finishAt.split('T')[0]}T00:00`});
  }
  onDescriptionChange(description) {
    this.setState({description});
  }
  async onCreate() {
    const body = {
      name: this.state.name,
      start: this.state.start,
      finish: this.state.finish,
      points: this.state.points,
    };
    if (this.state.description) body.description = this.state.description;
    const res = await fetch(`/api/projects/${this.props.ProjectId}/sprints`, {
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
          Create a New Sprint for <Icon name='briefcase' /> {this.state.project}
        </Header>
        <Form.Group>
          <Form.Input label='Name' placeholder='A fancy sprint name' value={this.state.name} onChange={e => this.onNameChange(e.target.value)} />
          <Form.Field>
            <label>Points Prediction</label>
            <Input>
              <input type='num' size='3' placeholder='0' value={this.state.points} onChange={e => this.onPointsChange(e.target.value)} />
            </Input>
          </Form.Field>
        </Form.Group>
        <Form.Group>
          <Form.Field>
            <label>Start</label>
            <input type='datetime-local' placeholder='YYYY-MM-DD' value={this.state.start} onChange={e => this.onStartChange(e.target.value)}/>
          </Form.Field>
          <Form.Field>
            <label>Finish</label>
            <input type='datetime-local' placeholder='YYYY-MM-DD' value={this.state.finish} onChange={e => this.onFinishChange(e.target.value)}/>
          </Form.Field>
        </Form.Group>
        <Form.TextArea label='Description' placeholder='Optional description ...' value={this.state.description} onChange={e => this.onDescriptionChange(e.target.value)} />
        <Form.Group>
          <Button primary content='Create Sprint' onClick={() => this.onCreate()} />
          <Button content='Cancel' onClick={() => this.setState({redirect: true})} />
        </Form.Group>
      </Form>
    );
  }
}

export default NewSprintView;