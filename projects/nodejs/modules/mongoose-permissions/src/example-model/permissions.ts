import { Example, ExampleDocument } from './model';
import { MongoosePermissions } from '../mongoose-permissions/mongoose-permissions';

export const ExamplePermissions = new MongoosePermissions<ExampleDocument>(Example, {
  create: {
    roles: {
      admin: ['name'],
    },
  },
  delete: {
    roles: {
      admin: true,
    },
  },
  find: {
    roles: {
      default: {
        name: { $ne: null },
      },
    },
  },
  populate: { path: 'parent' },
  read: {
    base: ['_id', 'createdAt', 'updatedAt'],
    roles: {
      admin: ['name'],
    },
  },
  roles: [
    {
      name: 'admin',
      query: { 'user.roles': { $eq: 'Admin' } },
    },
  ],
  update: {
    roles: {
      admin: ['name'],
    },
  },
});
