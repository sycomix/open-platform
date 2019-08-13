import { ContextMock } from '@tenlastic/web-server';
import { expect } from 'chai';

import { CollectionDocument, CollectionMock } from '../../../models';
import { handler } from './';

describe('handlers/collections/find', function() {
  let record: CollectionDocument;
  let user: any;

  beforeEach(async function() {
    record = await CollectionMock.create();
    user = { roles: ['Admin'] };
  });

  it('returns the matching records', async function() {
    const ctx = new ContextMock({
      params: { databaseId: record.databaseId },
      state: { user },
    });

    await handler(ctx as any);

    expect(ctx.response.body.records).to.exist;
    expect(ctx.response.body.records.length).to.eql(1);
  });
});