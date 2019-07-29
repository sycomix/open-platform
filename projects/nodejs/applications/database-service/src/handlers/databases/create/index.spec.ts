import { ContextMock } from '@tenlastic/api-module';
import { expect } from 'chai';
import * as Chance from 'chance';

import { handler } from '../create';

const chance = new Chance();

describe('handlers/collections/create', function() {
  let user: any;

  beforeEach(async function() {
    user = { roles: ['Admin'] };
  });

  it('creates a new record', async function() {
    const ctx = new ContextMock({
      request: {
        body: {
          name: chance.email(),
          userId: chance.hash(),
        },
      },
      state: { user },
    });

    await handler(ctx as any);

    expect(ctx.response.body.record).to.exist;
  });
});