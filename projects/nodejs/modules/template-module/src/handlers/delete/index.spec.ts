import { ContextMock } from '@tenlastic/api-module';
import { expect } from 'chai';

import { ExampleMock, ExampleDocument } from '../../../models';
import { handler } from '../delete';

describe('handlers/users/delete', function() {
  let record: ExampleDocument;
  let user: any;

  beforeEach(async function() {
    record = await ExampleMock.create();
    user = { roles: ['Admin'] };
  });

  it('returns the deleted record', async function() {
    const ctx = new ContextMock({
      params: {
        id: record._id,
      },
      state: { user },
    });

    await handler(ctx as any);

    expect(ctx.response.body.record).to.exist;
  });
});
