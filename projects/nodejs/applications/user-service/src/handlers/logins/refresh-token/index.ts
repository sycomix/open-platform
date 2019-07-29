import { Context } from '@tenlastic/api-module';
import * as jwt from 'jsonwebtoken';

import { RefreshToken, User } from '../../../models';

export async function handler(ctx: Context) {
  const { token } = ctx.request.body;

  if (!token) {
    throw new Error('Missing required parameters: token.');
  }

  let decodedToken: any;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    throw new Error('Invalid refresh token.');
  }

  if (!decodedToken.jti || !decodedToken.user || !decodedToken.user._id) {
    throw new Error('Invalid refresh token.');
  }

  const refreshTokenDocument = await RefreshToken.findOne({
    jti: decodedToken.jti,
    userId: decodedToken.user._id,
  });

  if (!refreshTokenDocument) {
    throw new Error('Invalid refresh token.');
  }

  const user = await User.findOne({ _id: refreshTokenDocument.userId });

  if (!user || !user.activatedAt) {
    throw new Error('Invalid refresh token.');
  }

  const { accessToken, refreshToken } = await user.logIn();

  ctx.response.body = { accessToken, refreshToken };
}