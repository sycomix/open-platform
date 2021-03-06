import * as kafka from '@tenlastic/mongoose-change-stream-kafka';
import * as rabbitmq from '@tenlastic/rabbitmq';
import * as mongoose from 'mongoose';

import { MONGO_DATABASE_NAME } from './constants';
import { Collection, Database } from './models';
import { CREATE_COLLECTION_INDEX_QUEUE, DELETE_COLLECTION_INDEX_QUEUE } from './workers';

kafka.connect(process.env.KAFKA_CONNECTION_STRING.split(','));

before(async function() {
  await mongoose.connect(process.env.MONGO_CONNECTION_STRING, {
    dbName: `${MONGO_DATABASE_NAME}-test`,
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await rabbitmq.connect({ url: process.env.RABBITMQ_CONNECTION_STRING });
});

beforeEach(async function() {
  await Collection.deleteMany({});
  await Database.deleteMany({});

  await rabbitmq.purge(CREATE_COLLECTION_INDEX_QUEUE);
  await rabbitmq.purge(DELETE_COLLECTION_INDEX_QUEUE);
});
