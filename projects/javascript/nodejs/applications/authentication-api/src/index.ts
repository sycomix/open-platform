import 'source-map-support/register';

import * as kafka from '@tenlastic/mongoose-change-stream-kafka';
import * as mailgun from '@tenlastic/mailgun';
import { WebServer, WebSocketServer } from '@tenlastic/web-server';
import * as mongoose from 'mongoose';

import { MONGO_DATABASE_NAME } from './constants';
import { router as connectionsRouter } from './handlers/connections';
import { router as loginsRouter } from './handlers/logins';
import { router as passwordResetsRouter } from './handlers/password-resets';
import { router as usersRouter } from './handlers/users';
import * as connectionSockets from './sockets/connections';
import * as userSockets from './sockets/users';

kafka.connect(process.env.KAFKA_CONNECTION_STRING.split(','));
mailgun.setCredentials(process.env.MAILGUN_DOMAIN, process.env.MAILGUN_KEY);

const connectionString = process.env.MONGO_CONNECTION_STRING;
mongoose.connect(connectionString, {
  dbName: MONGO_DATABASE_NAME,
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const webServer = new WebServer();
webServer.use(connectionsRouter.routes());
webServer.use(loginsRouter.routes());
webServer.use(passwordResetsRouter.routes());
webServer.use(usersRouter.routes());
webServer.start();

const webSocketServer = new WebSocketServer(webServer.server);
webSocketServer.connection('/connections', connectionSockets.onConnection);
webSocketServer.connection('/users', userSockets.onConnection);
webSocketServer.upgrade('/connections', connectionSockets.onUpgradeRequest);

export { webServer, webSocketServer };
