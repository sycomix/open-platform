import * as minio from '@tenlastic/minio';
import * as kafka from '@tenlastic/mongoose-change-stream-kafka';
import * as mongoose from 'mongoose';

import { MINIO_BUCKET, MONGO_DATABASE_NAME } from './constants';
import { Game, ReadonlyNamespace, ReadonlyUser } from './models';

before(async function() {
  const minioConnectionUrl = new URL(process.env.MINIO_CONNECTION_STRING);
  minio.connect({
    accessKey: minioConnectionUrl.username,
    endPoint: minioConnectionUrl.hostname,
    port: Number(minioConnectionUrl.port || '443'),
    secretKey: minioConnectionUrl.password,
    useSSL: minioConnectionUrl.protocol === 'https:',
  });

  const bucketExists = await minio.getClient().bucketExists(MINIO_BUCKET);
  if (!bucketExists) {
    await minio.getClient().makeBucket(MINIO_BUCKET, 'us-east-1');
  }

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
  await Game.deleteMany({});
  await ReadonlyNamespace.deleteMany({});
  await ReadonlyUser.deleteMany({});
});
