import * as kafka from '@tenlastic/mongoose-change-stream-kafka';
import * as mongoose from 'mongoose';

import { MONGO_DATABASE_NAME } from './constants';
import { Article, ReadonlyGame, ReadonlyNamespace, ReadonlyUser } from './models';

before(async function() {
  await kafka.connect(process.env.KAFKA_CONNECTION_STRING.split(','));
  await mongoose.connect(process.env.MONGO_CONNECTION_STRING, {
    dbName: `${MONGO_DATABASE_NAME}-test`,
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async function() {
  await Article.deleteMany({});
  await ReadonlyGame.deleteMany({});
  await ReadonlyNamespace.deleteMany({});
  await ReadonlyUser.deleteMany({});
});
