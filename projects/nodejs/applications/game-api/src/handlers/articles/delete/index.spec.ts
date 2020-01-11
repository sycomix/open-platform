import { ContextMock } from '@tenlastic/web-server';
import { expect, use } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';

import {
  ArticleDocument,
  ArticleMock,
  GameDocument,
  GameMock,
  ReadonlyNamespaceMock,
  ReadonlyUserDocument,
  ReadonlyUserMock,
  UserRolesMock,
} from '../../../models';
import { handler } from './';

use(chaiAsPromised);

describe('handlers/articles/delete', function() {
  let user: ReadonlyUserDocument;

  beforeEach(async function() {
    user = await ReadonlyUserMock.create();
  });

  context('when permission is granted', function() {
    let game: GameDocument;
    let record: ArticleDocument;

    beforeEach(async function() {
      const userRoles = UserRolesMock.create({ roles: ['Administrator'], userId: user._id });
      const namespace = await ReadonlyNamespaceMock.create({ accessControlList: [userRoles] });
      game = await GameMock.create({ namespaceId: namespace._id });
      record = await ArticleMock.create({ gameId: game._id });
    });

    it('returns the deleted record', async function() {
      const ctx = new ContextMock({
        params: {
          _id: record._id,
          gameSlug: game.slug,
        },
        state: { user: user.toObject() },
      });

      await handler(ctx as any);

      expect(ctx.response.body.record).to.exist;
    });
  });

  context('when permission is denied', function() {
    let game: GameDocument;
    let record: ArticleDocument;

    beforeEach(async function() {
      game = await GameMock.create();
      record = await ArticleMock.create({ gameId: game._id });
    });

    it('throws an error', async function() {
      const ctx = new ContextMock({
        params: {
          _id: record._id,
          gameId: game._id,
        },
        state: { user: user.toObject() },
      });

      const promise = handler(ctx as any);

      return expect(promise).to.be.rejected;
    });
  });
});