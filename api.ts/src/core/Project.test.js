import Project from './Project';
import models from '../db/models';

jest.mock('../db/models');

test('Project.create returns a Project instance', async () => {
  const toJSON = jest.fn();
  toJSON.mockReturnValue({});
  models.Project.create.mockResolvedValue({toJSON});
  expect(await Project.create('foo')).toBeInstanceOf(Project);
  expect(toJSON).toBeCalled();
});

test('Project.create throws ProjectNameExistsError', async () => {
  models.Project.create.mockRejectedValue(new models.Sequelize.UniqueConstraintError());
  await expect(async () => await Project.create('foo')).rejects.toThrow(Project.ProjectNameExistsError);
  expect(models.Project.create).toBeCalled();
});