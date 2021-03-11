import Sprint from './Sprint';
import SprintTransaction from './SprintTransaction';
import _ from 'lodash';
import dayjs from 'dayjs';
import { SprintTransactionAction } from './types';

export interface BurndownValues {
  net: number[],
  inc: number[],
  dec: number[],
}

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
    return dates.map(d => dayjs(d).format('MM/DD/YYYY'));
  }
  async realValues(): Promise<BurndownValues> {
    const [sprint, transactions] = await Promise.all([
      Sprint.findById(this.#SprintId), SprintTransaction.findAllInSprint(this.#SprintId)
    ]);
    const startAtDay = dayjs(sprint.startAt).startOf('d'),
      endAtDay = dayjs(sprint.endAt).startOf('d'),
      values = [],
      increments = [],
      decrements = [];
    for (let points = 0, dayCursor = startAtDay; dayCursor.isBefore(endAtDay, 'd') || dayCursor.isSame(endAtDay, 'd'); dayCursor = dayCursor.add(1, 'd')) {
      points = _.reduce(transactions.results, (acc, transaction): number => {
        if (dayCursor.isSame(dayjs(transaction.ts).startOf('d'), 'd')) {
          if (transaction.action === SprintTransactionAction.Claim) return acc + transaction.points;
          if (transaction.action === SprintTransactionAction.Complete) return acc - transaction.points;
          if (transaction.action === SprintTransactionAction.Remit) return acc - transaction.points;  
        }
        return acc;
      }, points);
      values.push(points);
      const incrs = _.reduce(transactions.results, (acc, transaction): number => {
        if (dayCursor.isSame(dayjs(transaction.ts).startOf('d'), 'd')) {
          return transaction.action === SprintTransactionAction.Claim ? acc + transaction.points : acc;
        }
        return acc;
      }, 0);
      increments.push(incrs);
      const decrs = _.reduce(transactions.results, (acc, transaction): number => {
        if (dayCursor.isSame(dayjs(transaction.ts).startOf('d'), 'd')) {
          return _.includes([SprintTransactionAction.Complete, SprintTransactionAction.Remit], transaction.action) ? acc + transaction.points : acc;
        }
        return acc;
      }, 0);
      decrements.push(decrs);
    }
    return {net: values, inc: increments, dec: decrements};
  }
  async idealValues(): Promise<number[]> {
    const sprint = await Sprint.findById(this.#SprintId);
    return [await sprint.claimedPoints(), 0];
  }
}

export default BurndownChart;
