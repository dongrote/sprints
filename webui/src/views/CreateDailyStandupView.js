import { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Button, Form, Header } from 'semantic-ui-react';


export default class CreateDailyStandupView extends Component {
  state = {
    redirect: false,
    whatDidIDoYesterday: '',
    whatAmIDoingToday: '',
    whatIsInMyWay: '',
  };

  onYesterdayChange(value) {
    this.setState({whatDidIDoYesterday: value});
  }

  onTodayChange(value) {
    this.setState({whatAmIDoingToday: value});
  }

  onBlockingChange(value) {
    this.setState({whatIsInMyWay: value});
  }

  async onSubmit() {
    const res = await fetch(`/api/sprints/${this.props.SprintId}/standups`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        whatDidIDoYesterday: this.state.whatDidIDoYesterday,
        whatAmIDoingToday: this.state.whatAmIDoingToday,
        whatIsInMyWay: this.state.whatIsInMyWay,
      })
    });
    if (res.ok) this.setState({redirect: true});
  }

  resetForm() {
    this.setState({whatDidIDoYesterday: '', whatAmIDoingToday: '', whatIsInMyWay: ''});
  }

  render() {
    if (this.state.redirect) return <Redirect to={`/sprint/${this.props.SprintId}`} />;
    return (
      <Form>
        <Header as='h1'>Submit Daily Standup Report</Header>
        <Form.TextArea
          label='What did I do yesterday?'
          value={this.state.whatDidIDoYesterday}
          onChange={e => this.onYesterdayChange(e.target.value)}
        />
        <Form.TextArea
          label='What am I doing today?'
          value={this.state.whatAmIDoingToday}
          onChange={e => this.onTodayChange(e.target.value)}
        />
        <Form.TextArea
          label='What is in my way?'
          value={this.state.whatIsInMyWay}
          onChange={e => this.onBlockingChange(e.target.value)}
        />
        <Form.Group>
          <Button primary content='Submit' onClick={() => this.onSubmit()} />
          <Button content='Reset' onClick={() => this.resetForm()} />
          <Button content='Cancel' onClick={() => this.setState({redirect: true})} />
        </Form.Group>
      </Form>
    );
  }
}
