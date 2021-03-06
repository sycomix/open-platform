import { ContextMock } from '@tenlastic/web-server';
import { expect, use } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';

import {
  FriendDocument,
  FriendMock,
  ReadonlyUserDocument,
  ReadonlyUserMock,
} from '../../../models';
import { handler } from './';

use(chaiAsPromised);

describe('handlers/friends/delete', function() {
  let friend: FriendDocument;
  let fromUser: ReadonlyUserDocument;
  let toUser: ReadonlyUserDocument;

  beforeEach(async function() {
    fromUser = await ReadonlyUserMock.create();
    toUser = await ReadonlyUserMock.create();

    friend = await FriendMock.create({ fromUserId: fromUser._id, toUserId: toUser._id });
  });

  context('when permission is granted', function() {
    it('returns the deleted record', async function() {
      const ctx = new ContextMock({
        params: { _id: friend._id },
        state: { user: fromUser.toObject() },
      });

      await handler(ctx as any);

      expect(ctx.response.body.record.fromUserId.toString()).to.eql(fromUser._id.toString());
    });
  });

  context('when permission is denied', function() {
    it('returns a permission error', async function() {
      const ctx = new ContextMock({
        params: { _id: friend._id },
        state: { user: toUser.toObject() },
      });

      const promise = handler(ctx as any);

      return expect(promise).to.be.rejectedWith('Friend not found.');
    });
  });
});
