import { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Button, Form, Header } from 'semantic-ui-react';
import dayjs from 'dayjs';

export default class CreateDailyStandupView extends Component {
  state = {
    redirect: false,
    createdAt: null,
    whatDidIDoYesterday: '',
    whatAmIDoingToday: '',
    whatIsInMyWay: '',
  };
  currentStandupValues = {};

  onYesterdayChange(value) {
    this.setState({whatDidIDoYesterday: value});
  }

  onTodayChange(value) {
    this.setState({whatAmIDoingToday: value});
  }

  onBlockingChange(value) {
    this.setState({whatIsInMyWay: value});
  }

  async onUpdate() {
    const res = await fetch(`/api/sprints/${this.props.SprintId}/standups`, {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        DailyStandupId: this.props.DailyStandupId,
        whatDidIDoYesterday: this.state.whatDidIDoYesterday,
        whatAmIDoingToday: this.state.whatAmIDoingToday,
        whatIsInMyWay: this.state.whatIsInMyWay,
      })
    });
    if (res.ok) this.setState({redirect: true});
  }

  resetForm() {
    this.setState({
      createdAt: this.currentStandupValues.createdAt,
      whatDidIDoYesterday: this.currentStandupValues.whatDidIDoYesterday,
      whatAmIDoingToday: this.currentStandupValues.whatAmIDoingToday,
      whatIsInMyWay: this.currentStandupValues.whatIsInMyWay,
    });
  }

  async fetchDailyStandup(DailyStandupId) {
    const res = await fetch(`/api/sprints/0/standups/${DailyStandupId}`);
    if (res.ok) {
      const json = await res.json();
      this.currentStandupValues = json;
      this.resetForm();
    } else {
      this.setState({redirect: true});
    }
  }

  async componentDidMount() {
    await this.fetchDailyStandup(this.props.DailyStandupId);
  }

  render() {
    if (this.state.redirect) return <Redirect to={`/sprint/${this.props.SprintId}`} />;
    return (
      <Form>
        <Header as='h1'>Edit Daily Standup Report ({dayjs(this.state.createdAt).format('ddd, MMM D, YYYY')})</Header>
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
          <Button primary icon='save' content='Update' onClick={() => this.onUpdate()} />
          <Button icon='undo' content='Reset' onClick={() => this.resetForm()} />
          <Button icon='close' content='Cancel' onClick={() => this.setState({redirect: true})} />
        </Form.Group>
      </Form>
    );
  }
}
