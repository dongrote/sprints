import _ from 'lodash';
import models from '../db/models';

interface SequelizeUser {
  id: number;
  email: string;
  identityProvider: string;
  firstName: string|null;
  lastName: string|null;
  displayName: string|null;
  systemRole: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DefaultUserValues {
  identityProvider: string;
  systemRole: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
}

export default class User {
  id: number;
  systemRole: string;
  email: string;
  identityProvider: string;
  firstName: string|null;
  lastName: string|null;
  displayName: string|null;

  static async findOrCreateByEmail(email: string, defaults?: DefaultUserValues): Promise<User> {
    const [user] = await models.User.findOrCreate({
      where: {email},
      defaults: _.pick(defaults, ['identityProvider', 'systemRole', 'firstName', 'lastName', 'displayName']),
    });
    return new User(user.toJSON());
  }

  constructor(dbRow: SequelizeUser) {
    this.id = dbRow.id;
    this.email = dbRow.email;
    this.identityProvider = dbRow.identityProvider;
    this.firstName = dbRow.firstName;
    this.lastName = dbRow.lastName;
    this.displayName = dbRow.displayName;
  }
}
