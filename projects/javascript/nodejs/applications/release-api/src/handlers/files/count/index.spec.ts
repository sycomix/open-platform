import { ContextMock } from '@tenlastic/web-server';
import { expect } from 'chai';

import {
  FileDocument,
  FileMock,
  ReadonlyGameMock,
  ReadonlyNamespaceMock,
  ReadonlyUserDocument,
  ReadonlyUserMock,
  ReleaseDocument,
  ReleaseMock,
  UserRolesMock,
} from '../../../models';
import { handler } from './';

describe('handlers/files/count', function() {
  let record: FileDocument;
  let release: ReleaseDocument;
  let user: ReadonlyUserDocument;

  beforeEach(async function() {
    user = await ReadonlyUserMock.create();

    const userRoles = UserRolesMock.create({ roles: ['Administrator'], userId: user._id });
    const namespace = await ReadonlyNamespaceMock.create({ accessControlList: [userRoles] });
    const game = await ReadonlyGameMock.create({ namespaceId: namespace._id });

    release = await ReleaseMock.create({ gameId: game._id });
    record = await FileMock.create({ releaseId: release._id });
  });

  it('returns the number of matching records', async function() {
    const ctx = new ContextMock({
      params: { platform: record.platform, releaseId: release._id },
      state: { user: user.toObject() },
    });

    await handler(ctx as any);

    expect(ctx.response.body.count).to.eql(1);
  });
});
