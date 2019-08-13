import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { Chance } from 'chance';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';

import { Example, ExampleDocument, ExamplePermissions } from '../example-model';

const chance = new Chance();
const expect = chai.expect;

chai.use(chaiAsPromised);
chai.use(sinonChai);

describe('permissions', function() {
  let admin: any;
  let sandbox: sinon.SinonSandbox;
  let user: any;

  beforeEach(async function() {
    sandbox = sinon.createSandbox();

    admin = { roles: ['Admin'] };
    user = { roles: [] };
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe('count()', function() {
    beforeEach(async function() {
      await Example.mock({ name: chance.hash() });
      await Example.mock({ name: null });
    });

    context('when user is an admin', function() {
      it('returns all the records', async function() {
        const results = await ExamplePermissions.count({}, {}, admin);

        expect(results).to.eql(2);
      });
    });

    context('when user is not an admin', function() {
      it('returns accessible records', async function() {
        const results = await ExamplePermissions.count({}, {}, user);

        expect(results).to.eql(1);
      });
    });
  });

  describe('create()', function() {
    context('when user is an admin', function() {
      it('creates a new record', async function() {
        const params = {
          name: chance.hash(),
        };

        const record = await ExamplePermissions.create(params, {}, admin);

        expect(record._id).to.exist;
        expect(record.createdAt).to.exist;
        expect(record.name).to.eql(params.name);
        expect(record.updatedAt).to.exist;
      });
    });

    context('when user is not an admin', function() {
      it('returns an error', async function() {
        const params = {
          name: chance.hash(),
        };

        const promise = ExamplePermissions.create(params, {}, user);

        return expect(promise).to.be.rejectedWith(
          'User does not have permission to perform this action.',
        );
      });
    });
  });

  describe('delete()', function() {
    let record: ExampleDocument;

    beforeEach(async function() {
      record = await Example.mock();
    });

    context('when the user is an admin', function() {
      it('returns the user', async function() {
        const results = await ExamplePermissions.delete(record, admin);

        expect(results).to.eql(record);
      });
    });

    context('when the user is not an admin', function() {
      it('returns an error', async function() {
        const promise = ExamplePermissions.delete(record, user);

        return expect(promise).to.be.rejectedWith(
          'User does not have permission to perform this action.',
        );
      });
    });
  });

  describe('find()', function() {
    beforeEach(async function() {
      await Example.mock({ name: chance.hash() });
    });

    context('when user is an admin', function() {
      it('returns all the records', async function() {
        const results = await ExamplePermissions.find({}, {}, admin);

        expect(results.length).to.eql(1);
      });
    });

    context('when user is not an admin', function() {
      it('returns accessible records', async function() {
        const results = await ExamplePermissions.find({}, {}, user);

        expect(results.length).to.eql(1);
      });
    });
  });

  describe('read()', function() {
    let record: ExampleDocument;

    beforeEach(async function() {
      record = await Example.mock();
    });

    context('when user is an admin', function() {
      it('returns the record', async function() {
        record = await ExamplePermissions.read(record, admin);

        expect(record._id).to.exist;
        expect(record.createdAt).to.exist;
        expect(record.name).to.exist;
        expect(record.updatedAt).to.exist;
      });
    });

    context('when user is not an admin', function() {
      it('returns the record', async function() {
        record = await ExamplePermissions.read(record, user);

        expect(record._id).to.exist;
        expect(record.createdAt).to.exist;
        expect(record.name).to.not.exist;
        expect(record.updatedAt).to.exist;
      });
    });
  });

  describe('update()', function() {
    let record: ExampleDocument;

    beforeEach(async function() {
      record = await Example.mock();
    });

    context('when the user is an admin', function() {
      it('updates and returns the record', async function() {
        const params = {
          name: chance.hash(),
        };

        record = await ExamplePermissions.update(record, params, {}, admin);

        expect(record._id).to.exist;
        expect(record.createdAt).to.exist;
        expect(record.name).to.eql(params.name);
        expect(record.updatedAt).to.exist;
      });
    });

    context('when the user is not an admin', function() {
      it('returns an error', async function() {
        const params = {
          name: chance.hash(),
        };

        const promise = ExamplePermissions.update(record, params, {}, user);

        return expect(promise).to.be.rejectedWith(
          'User does not have permission to perform this action.',
        );
      });
    });
  });

  describe('where()', function() {
    context('when the user is an admin', function() {
      it('returns a valid where query', async function() {
        const query = await ExamplePermissions.where({}, admin);

        expect(query).to.be.empty;
      });
    });

    context('when the user is not an admin', function() {
      it('returns a valid where query', async function() {
        const query = await ExamplePermissions.where({}, user);

        expect(query.name).to.eql({ $ne: null });
      });
    });
  });
});