import { Component } from 'react';
import { Form, Header, Icon, TextArea } from 'semantic-ui-react';
import dayjs from 'dayjs';

const IconLabelTextArea = props => (
  <Form.Field>
    <label>
      <Icon name={props.icon} />
      {props.label}
    </label>
    <TextArea value={props.value} onChange={e => {
      if (props.onChange) props.onChange(e);
    }} />
  </Form.Field>
);

export default class EditDailyStandupForm extends Component {
  state = {
    createdAt: null,
    whatDidIDoYesterday: '',
    whatAmIDoingToday: '',
    whatIsInMyWay: '',
  };
  currentStandupValues = {};

  dismiss() {
    if (this.props.onDismiss) this.props.onDismiss();
  }

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
    const res = await fetch(`/api/sprints/0/standups`, {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        DailyStandupId: this.props.DailyStandupId,
        whatDidIDoYesterday: this.state.whatDidIDoYesterday,
        whatAmIDoingToday: this.state.whatAmIDoingToday,
        whatIsInMyWay: this.state.whatIsInMyWay,
      })
    });
    if (res.ok) this.dismiss();
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
      this.dismiss();
    }
  }

  async componentDidMount() {
    await this.fetchDailyStandup(this.props.DailyStandupId);
  }

  render() {
    return (
      <Form>
        <Header>Edit Daily Standup Report ({dayjs(this.state.createdAt).format('ddd, MMM D, YYYY')})</Header>
        <IconLabelTextArea
          icon='history'
          label='What did I do yesterday?'
          value={this.state.whatDidIDoYesterday}
          onChange={e => this.onYesterdayChange(e.target.value)}
        />
        <IconLabelTextArea
          icon='keyboard outline'
          label='What am I doing today?'
          value={this.state.whatAmIDoingToday}
          onChange={e => this.onTodayChange(e.target.value)}
        />
        <IconLabelTextArea
          icon='shield'
          label='What is in my way?'
          value={this.state.whatIsInMyWay}
          onChange={e => this.onBlockingChange(e.target.value)}
        />
        <Form.Group widths='equal'>
          <Form.Button fluid primary icon='save' content='Update' onClick={() => this.onUpdate()} />
          <Form.Button basic fluid icon='undo' content='Reset' onClick={() => this.resetForm()} />
          <Form.Button fluid icon='close' content='Cancel' onClick={() => this.dismiss()} />
        </Form.Group>
      </Form>
    );
  }
}
