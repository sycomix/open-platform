import { ContextMock } from '@tenlastic/web-server';
import { expect, use } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as Chance from 'chance';

import {
  DatabaseMock,
  ReadonlyNamespaceMock,
  ReadonlyUserDocument,
  ReadonlyUserMock,
  UserRolesMock,
} from '../../../models';
import { handler } from './';

const chance = new Chance();
use(chaiAsPromised);

describe('handlers/collections/create', function() {
  let user: ReadonlyUserDocument;

  beforeEach(async function() {
    user = await ReadonlyUserMock.create();
  });

  context('when permission is granted', function() {
    it('creates a new record', async function() {
      const userRoles = UserRolesMock.create({ roles: ['Administrator'], userId: user._id });
      const namespace = await ReadonlyNamespaceMock.create({ accessControlList: [userRoles] });
      const database = await DatabaseMock.create({ namespaceId: namespace._id });

      const ctx = new ContextMock({
        params: {
          databaseName: database.name,
        },
        request: {
          body: {
            name: chance.hash(),
          },
        },
        state: { user },
      });

      await handler(ctx as any);

      expect(ctx.response.body.record).to.exist;
    });
  });

  context('when permission is denied', function() {
    it('throws an error', async function() {
      const namespace = await ReadonlyNamespaceMock.create();
      const database = await DatabaseMock.create({ namespaceId: namespace._id });

      const ctx = new ContextMock({
        params: {
          databaseName: database.name,
        },
        request: {
          body: {
            name: chance.hash(),
          },
        },
        state: { user },
      });

      const promise = handler(ctx as any);

      return expect(promise).to.be.rejected;
    });
  });
});
