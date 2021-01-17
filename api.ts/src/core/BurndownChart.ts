import Sprint from './Sprint';
import SprintTransaction from './SprintTransaction';
import _ from 'lodash';
import dayjs from 'dayjs';
import { SprintTransactionAction } from './types';

class BurndownChart {
  static async createFromSprint(SprintId: number) {
    return new BurndownChart(SprintId);
  }
  #SprintId: number;
  constructor(SprintId: number) {
    this.#SprintId = SprintId;
  }
  async labels(): Promise<string[]> {
    const sprint = await Sprint.findById(this.#SprintId);
    const dates = await sprint.sprintDays();
    return dates.map(d => dayjs(d).format('MM/DD'));
  }
  async realValues(): Promise<number[]> {
    const [sprint, transactions] = await Promise.all([
      Sprint.findById(this.#SprintId), SprintTransaction.findAllInSprint(this.#SprintId)
    ]);
    const startAtDay = dayjs(sprint.startAt).startOf('d'),
      endAtDay = dayjs(sprint.endAt).startOf('d'),
      values = [];
    for (let points = 0, dayCursor = startAtDay; dayCursor.isBefore(endAtDay, 'd') || dayCursor.isSame(endAtDay, 'd'); dayCursor = dayCursor.add(1, 'd')) {
      points = _.reduce(transactions, (acc, transaction): number => {
        if (dayCursor.isSame(dayjs(transaction.ts).startOf('d'), 'd')) {
          if (transaction.action === SprintTransactionAction.Claim) return acc + transaction.points;
          if (transaction.action === SprintTransactionAction.Complete) return acc - transaction.points;
          if (transaction.action === SprintTransactionAction.Remit) return acc - transaction.points;  
        }
        return acc;
      }, points);
      values.push(points);
    }
    return values;
  }
  async idealValues(): Promise<number[]> {
    const sprint = await Sprint.findById(this.#SprintId);
    return [await sprint.claimedPoints(), 0];
  }
}

export default BurndownChart;
