import { ContextMock } from '@tenlastic/api-module';
import { expect } from 'chai';
import * as Chance from 'chance';

import { DatabaseMock, DatabaseDocument } from '../../../models';
import { handler } from '.';

const chance = new Chance();

describe('handlers/collections/update', function() {
  let record: DatabaseDocument;
  let user: any;

  beforeEach(async function() {
    record = await DatabaseMock.create();
    user = { roles: ['Admin'] };
  });

  it('updates an existing record', async function() {
    const ctx = new ContextMock({
      params: {
        id: record._id,
      },
      request: {
        body: {
          name: chance.hash(),
          userId: chance.hash(),
        },
      },
      state: { user },
    });

    await handler(ctx as any);

    expect(ctx.response.body.record).to.exist;
  });
});