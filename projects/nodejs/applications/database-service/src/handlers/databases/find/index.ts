import { Context, RestController } from '@tenlastic/api-module';

import { Database, DatabasePermissions } from '../../../models';

const restController = new RestController(Database, new DatabasePermissions());

export async function handler(ctx: Context) {
  console.log(ctx.state);
  const result = await restController.find(ctx.request.query, ctx.state.user);

  ctx.response.body = { records: result };
}
