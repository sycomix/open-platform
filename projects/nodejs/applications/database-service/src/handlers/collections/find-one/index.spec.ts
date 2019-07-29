import { ContextMock } from '@tenlastic/api-module';
import { expect } from 'chai';

import { CollectionMock, CollectionDocument } from '../../../models';
import { handler } from '../find-one';

describe('handlers/collections/find-one', function() {
  let record: CollectionDocument;
  let user: any;

  beforeEach(async function() {
    record = await CollectionMock.create();
    user = { roles: ['Admin'] };
  });

  it('returns the matching record', async function() {
    const ctx = new ContextMock({
      params: {
        id: record._id,
      },
      state: { user },
    });

    await handler(ctx as any);

    expect(ctx.response.body.record).to.exist;
    expect(ctx.response.body.record.id).to.eql(record.id);
  });
});
