import SprintTransaction from './SprintTransaction';
import models from '../db/models';

jest.mock('../db/models');

test('SprintTransaction.create returns a SprintTransaction instance', async () => {
  const toJSON = jest.fn();
  toJSON.mockReturnValue({});
  models.SprintTransaction.create.mockResolvedValue({toJSON});
  expect(await SprintTransaction.create()).toBeInstanceOf(SprintTransaction);
  expect(toJSON).toBeCalled();
});