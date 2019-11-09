import * as mongoose from 'mongoose';

import { connect } from './connect';

const connectionString = process.env.MONGO_CONNECTION_STRING;
const databaseName = process.env.MONGO_DATABASE_NAME;
mongoose.connect(connectionString, {
  dbName: databaseName,
  useFindAndModify: false,
  useNewUrlParser: true,
});

before(async function() {
  await connect(process.env.KAFKA_CONNECTION_STRING.split(','));
});