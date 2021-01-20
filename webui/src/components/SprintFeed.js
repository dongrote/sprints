import { Component } from 'react';
import { Button, Feed, Grid, Header, Icon } from 'semantic-ui-react';
import day from 'dayjs';

const actionIcons = {
  CLAIM: 'calendar plus outline',
  UNCLAIM: 'calendar minus outline',
  COMPLETE: 'calendar check outline',
};

const actionColors = {
  UNCLAIM: 'red',
  COMPLETE: 'blue',
};

class SprintFeed extends Component {
  offset = 0;
  state = {transactions: [], total: 0};
  async fetchTransactionsAtOffset(offset, limit) {
    const res = await fetch(`/api/sprints/${this.props.SprintId}/transactions?offset=${offset}&limit=${limit}&reverse`)
    if (res.ok) {
      const {count, results} = await res.json();
      this.setState({transactions: this.state.transactions.concat(results), total: count});
    }
  }
  async fetchMoreTransactions() {
    await this.fetchTransactionsAtOffset(this.offset, 5);
    this.offset += 5;
  }
  async componentDidMount() {
    await this.fetchMoreTransactions();
  }
  render() {
    return (
      <Feed>
        <Header content='Activity feed'/>
        {this.state.transactions.map((transaction, i) => (
          <Feed.Event key={i}>
            <Feed.Label>
              <Icon name={actionIcons[transaction.action]} color={actionColors[transaction.action]} />
            </Feed.Label>
            <Feed.Content>
              <Feed.Date>
                {day(transaction.ts).format('MMM D, YYYY HH:mm')}
              </Feed.Date>
              <Feed.Summary>
                {transaction.action === 'CLAIM' && `Claimed '${transaction.Story.title}'`}
                {transaction.action === 'COMPLETE' && `Completed '${transaction.Story.title}'`}
              </Feed.Summary>
              <Feed.Meta>
                {`${transaction.points} point${transaction.points === 1 ? '' : 's'}`}
              </Feed.Meta>
            </Feed.Content>
          </Feed.Event>
        ))}
        <Grid columns={1}>
          <Grid.Row textAlign='center'>
            <Grid.Column>
              {this.state.total > this.state.transactions.length && <Button basic content='Load more' onClick={() => this.fetchMoreTransactions()} />}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Feed>
    );
  }
}

export default SprintFeed;
