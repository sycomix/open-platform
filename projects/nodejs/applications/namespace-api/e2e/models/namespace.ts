import * as e2e from '@tenlastic/e2e';
import * as Chance from 'chance';
import * as mongoose from 'mongoose';

import { NamespaceDocument } from '../../src/models';

const chance = new Chance();

export class NamespaceModel {
  private static records: any[] = [];

  public static async create(params: Partial<NamespaceDocument> = {}, user: any = {}) {
    const defaults = {
      name: chance.hash(),
    };
    const path = `/namespaces`;
    user = { activatedAt: new Date(), roles: ['Admin'], ...user };

    const response = await e2e.request('post', path, { ...defaults, ...params }, { user });

    if (response.statusCode === 200) {
      this.records.push(response.body.record);
    }

    return response;
  }

  public static async delete(params: Partial<NamespaceDocument>, user: any = {}) {
    if (!params._id) {
      throw new Error('Missing required parameters: _id.');
    }

    const path = `/namespaces/${params._id}`;
    user = { activatedAt: new Date(), roles: ['Admin'], ...user };

    return e2e.request('delete', path, params, { user });
  }

  public static async deleteAll() {
    return Promise.all(
      this.records.map((r, i) => {
        this.records.splice(i, 1);
        return this.delete(r);
      }),
    );
  }

  public static async findOne(params: any = {}, user: any = {}) {
    if (!params._id) {
      throw new Error('Missing required parameters: _id.');
    }

    const path = `/namespaces/${params._id}`;
    user = { activatedAt: new Date(), roles: ['Admin'], ...user };

    return e2e.request('get', path, params, { user });
  }

  public static async update(params: any = {}, user: any = {}) {
    if (!params._id) {
      throw new Error('Missing required parameters: _id.');
    }

    const path = `/namespaces/${params._id}`;
    user = { activatedAt: new Date(), roles: ['Admin'], ...user };

    return e2e.request('put', path, params, { user });
  }
}
