import * as Chance from 'chance';

import { User, UserSchema } from './user.model';

export class UserMock {
  /**
   * Creates a record with randomized required parameters if not specified.
   * @param {Object} params The parameters to initialize the record with.
   */
  public static async create(params: Partial<UserSchema> = {}) {
    const chance = new Chance();

    const defaults = {
      activatedAt: new Date(),
      email: chance.email(),
      username: chance.hash({ length: 20 }),
    };

    return User.create({ ...defaults, ...params });
  }
}