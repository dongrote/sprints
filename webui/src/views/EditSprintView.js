import { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Button, Form, Header, Icon, Input } from 'semantic-ui-react';

class NewSprintView extends Component {
  state = {
    project: '',
    ProjectId: null,
    previousName: '',
    previousPoints: '',
    previousDescription: '',
    previousStart: null,
    previousFinish: null,
    name: '',
    points: 0,
    description: '',
    start: null,
    finish: null,
    redirect: false,
  };
  async loadSprint(SprintId) {
    const res = await fetch(`/api/sprints/${SprintId}`);
    if (res.ok) {
      const json = await res.json();
      this.setState({
        project: json.Project.name,
        ProjectId: json.ProjectId,
        previousName: json.title,
        name: json.title,
        previousPoints: json.predictedPoints,
        points: json.predictedPoints,
        previousStart: json.startAt,
        start: json.startAt,
        previousFinish: json.finishAt,
        finish: json.finishAt,
        previousDescription: json.description,
        description: json.description,
      });
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
  async onUpdate() {
    const body = {};
    if (this.state.name !== this.state.previousName) body.title = this.state.name;
    if (this.state.points !== this.state.previousPoints) body.predictedPoints = this.state.points;
    if (this.state.start !== this.state.previousStart) body.startAt = this.state.start;
    if (this.state.finish !== this.state.previousFinish) body.finishAt = this.state.finish;
    if (this.state.description !== this.state.previousDescription) body.description = this.state.description;
    const res = await fetch(`/api/sprints/${this.props.SprintId}`, {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(body)
    });
    if (res.ok) {
      this.setState({redirect: true});
    }
  }
  async componentDidMount() {
    await this.loadSprint(this.props.SprintId);
  }
  render() {
    if (this.state.redirect) return <Redirect to={`/sprint/${this.props.SprintId}`} />;
    return (
      <Form>
        <Header as='h1'>
          Update Sprint for <Icon name='briefcase' /> {this.state.project}
        </Header>
        <Form.Group>
          <Form.Input label='Name' placeholder={this.state.previousName} value={this.state.name} onChange={e => this.onNameChange(e.target.value)} />
          <Form.Field>
            <label>Points Prediction</label>
            <Input>
              <input type='num' size='3' placeholder={this.state.previousPoints} value={this.state.points} onChange={e => this.onPointsChange(e.target.value)} />
            </Input>
          </Form.Field>
        </Form.Group>
        <Form.Group>
          <Form.Field>
            <label>Start</label>
            <input type='datetime-local' placeholder={this.state.previousStart} value={this.state.start} onChange={e => this.onStartChange(e.target.value)}/>
          </Form.Field>
          <Form.Field>
            <label>Finish</label>
            <input type='datetime-local' placeholder={this.state.previousFinish} value={this.state.finish} onChange={e => this.onFinishChange(e.target.value)}/>
          </Form.Field>
        </Form.Group>
        <Form.TextArea label='Description' placeholder={this.state.previousDescription || 'Optional description ...'} value={this.state.description} onChange={e => this.onDescriptionChange(e.target.value)} />
        <Form.Group>
          <Button primary content='Update Sprint' onClick={() => this.onUpdate()} />
          <Button content='Cancel' onClick={() => this.setState({redirect: true})} />
        </Form.Group>
      </Form>
    );
  }
}

export default NewSprintView;