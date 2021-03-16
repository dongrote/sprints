import { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Button, Card, Container, Divider, Form, Header, Icon, Input } from 'semantic-ui-react';

class NewUserStoryView extends Component {
  state = {
    project: '',
    title: '',
    action: '',
    role: '',
    benefit: '',
    points: 0,
    redirect: false,
  };
  async fetchProjectName(ProjectId) {
    const res = await fetch(`/api/projects/${ProjectId}`);
    if (res.ok) {
      const json = await res.json();
      this.setState({project: json.name});
    }
  }
  onRoleChange(role) { this.setState({role}); }
  onActionChange(action) { this.setState({action}); }
  onTitleChange(title) { this.setState({title}); }
  onBenefitChange(benefit) { this.setState({benefit}); }
  onPointsChange(points) {
    const n = Number(points);
    if (isNaN(n)) return;
    if (n < 0) return;
    if (n > 100) return;
    this.setState({points: n});
  }
  description() {
    return `As a ${this.state.role}, I want to ${this.state.action}, so I can ${this.state.benefit}`;
  }
  async onCreate() {
    const body = {
      ProjectId: this.props.ProjectId,
      title: this.state.title || this.state.action,
      points: this.state.points,
      description: this.description(),
    };
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
      <Container text>
      <Card fluid>
        <Card.Content>
          <Card.Header>
            Create a New User Story for <Icon name='briefcase' /> {this.state.project}
          </Card.Header>
        </Card.Content>
        <Card.Content extra>
        <Form>
        <Form.Group>
          <Form.Field>
            <label>Title</label>
            <Input>
              <input
                size='30'
                placeholder={this.state.action}
                value={this.state.title}
                onChange={e => this.onTitleChange(e.target.value)}
              />
            </Input>
          </Form.Field>
          <Form.Field>
            <label>Points</label>
            <Input>
              <input
                type='num'
                size='3'
                placeholder='0'
                value={this.state.points}
                onChange={e => this.onPointsChange(e.target.value)}
              />
            </Input>
          </Form.Field>
        </Form.Group>
        <Divider />
        <Form.Group>
          <Form.Field>
            <label>As a</label>
            <Input>
              <input
                size='30'
                placeholder='user, administrator, etc.'
                value={this.state.role}
                onChange={e => this.onRoleChange(e.target.value)}
              />
            </Input>
          </Form.Field>
        </Form.Group>
        <Form.Group>
          <Form.Field>
            <label>I want to</label>
            <Input>
              <input
                size='30'
                placeholder='do a thing'
                value={this.state.action}
                onChange={e => this.onActionChange(e.target.value)}
              />
            </Input>
          </Form.Field>
        </Form.Group>
        <Form.Group>
          <Form.Field>
            <label>So I can</label>
            <Input>
              <textarea
                rows='3'
                cols='40'
                placeholder='achieve this, that, and the other'
                value={this.state.benefit}
                onChange={e => this.onBenefitChange(e.target.value)}
              />
            </Input>
          </Form.Field>
        </Form.Group>
        <Divider />
        <Form.Group>
          <Button primary content='Create User Story' onClick={() => this.onCreate()} />
          <Button content='Cancel' onClick={() => this.setState({redirect: true})} />
        </Form.Group>
      </Form>
        </Card.Content>
      </Card>
      </Container>
    );
  }
}

export default NewUserStoryView;
