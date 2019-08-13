import { Context, ContextMock } from '@tenlastic/web-server';
import * as rabbitmq from '@tenlastic/rabbitmq';
import { expect, use } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as mongoose from 'mongoose';

import { CollectionMock, CollectionSchema, DatabaseMock } from '../../../models';
import { handler } from './';

use(chaiAsPromised);

describe('handlers/indexes/delete', function() {
  let user: any;

  beforeEach(async function() {
    user = { _id: new mongoose.Types.ObjectId(), roles: ['Admin'] };
  });

  context('when the collection is not found', function() {
    it('throws an error', async function() {
      const ctx = new ContextMock({
        params: {
          collectionId: new mongoose.Types.ObjectId(),
          databaseId: new mongoose.Types.ObjectId(),
        },
        state: { user },
      });

      const promise = handler(ctx as any);

      return expect(promise).to.be.rejectedWith('Collection not found.');
    });
  });

  context('when the collection is found', function() {
    context('when the user does not have permission', function() {
      it('throws an error', async function() {
        const database = await DatabaseMock.create({ userId: user._id });
        const collection = await CollectionMock.create({ databaseId: database._id });
        const ctx = new ContextMock({
          params: {
            collectionId: collection._id,
            databaseId: collection.databaseId,
          },
          state: { user: { _id: user._id, roles: [] } },
        });

        const promise = handler(ctx as any);

        return expect(promise).to.be.rejectedWith(
          'User does not have permission to perform this action.',
        );
      });
    });

    context('when the user has permission', function() {
      let ctx: Context;

      beforeEach(async function() {
        const database = await DatabaseMock.create({ userId: user._id });
        const collection = await CollectionMock.create({
          databaseId: database._id,
          indexes: [{ key: { properties: 1 } }],
        });
        ctx = new ContextMock({
          params: {
            collectionId: collection._id,
            databaseId: collection.databaseId,
            id: collection.indexes[0]._id,
          },
          request: {
            body: {
              key: { properties: 1 },
            },
          },
          state: { user },
        }) as Context;

        await handler(ctx as any);
      });

      afterEach(async function() {
        await rabbitmq.purge(CollectionSchema.DELETE_INDEX_QUEUE);
      });

      it('returns a 200 status code', async function() {
        expect(ctx.response.status).to.eql(200);
      });

      it('adds the request to RabbitMQ', async function() {
        return new Promise(resolve => {
          rabbitmq.consume(CollectionSchema.DELETE_INDEX_QUEUE, (channel, content, msg) => {
            expect(content.indexId).to.eql(ctx.params.id.toString());

            resolve();
          });
        });
      });
    });
  });
});