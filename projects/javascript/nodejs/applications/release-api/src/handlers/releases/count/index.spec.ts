import { ContextMock } from '@tenlastic/web-server';
import { expect } from 'chai';

import {
  ReadonlyGameMock,
  ReadonlyNamespaceMock,
  ReadonlyUserDocument,
  ReadonlyUserMock,
  ReleaseMock,
  UserRolesMock,
} from '../../../models';
import { handler } from './';

describe('handlers/releases/count', function() {
  let user: ReadonlyUserDocument;

  beforeEach(async function() {
    user = await ReadonlyUserMock.create();

    const userRoles = UserRolesMock.create({ roles: ['Administrator'], userId: user._id });
    const namespace = await ReadonlyNamespaceMock.create({ accessControlList: [userRoles] });
    const game = await ReadonlyGameMock.create({ namespaceId: namespace._id });

    await ReleaseMock.create({ gameId: game._id });
  });

  it('returns the number of matching records', async function() {
    const ctx = new ContextMock({
      state: { user: user.toObject() },
    });

    await handler(ctx as any);

    expect(ctx.response.body.count).to.eql(1);
  });
});
