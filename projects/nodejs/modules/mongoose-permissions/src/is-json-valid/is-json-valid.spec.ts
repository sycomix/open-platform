import { expect } from 'chai';

import { isJsonValid } from './is-json-valid';

describe('is-json-valid', function() {
  describe('isJsonValid()', function() {
    describe('$eq', function() {
      context('when the reference is an array', function() {
        it('returns true', function() {
          const json = {
            user: {
              roles: ['Admin'],
            },
          };
          const query = {
            'user.roles': { $eq: 'Admin' },
          };

          const result = isJsonValid(json, query);

          expect(result).to.eql(true);
        });

        it('returns false', function() {
          const json = {
            user: {
              roles: ['Admin'],
            },
          };
          const query = {
            'user.roles': { $eq: 'Owner' },
          };

          const result = isJsonValid(json, query);

          expect(result).to.eql(false);
        });
      });

      context('when the reference is not an array', function() {
        it('returns true', function() {
          const json = {
            user: {
              _id: '123',
            },
          };
          const query = {
            'user._id': { $eq: '123' },
          };

          const result = isJsonValid(json, query);

          expect(result).to.eql(true);
        });

        it('returns false', function() {
          const json = {
            user: {
              _id: '123',
            },
          };
          const query = {
            'user._id': { $eq: '1' },
          };

          const result = isJsonValid(json, query);

          expect(result).to.eql(false);
        });
      });
    });

    describe('$in', function() {
      context('when the reference is an array', function() {
        it('returns true', function() {
          const json = {
            user: {
              roles: ['Admin'],
            },
          };
          const query = {
            'user.roles': { $in: ['Admin', 'Owner'] },
          };

          const result = isJsonValid(json, query);

          expect(result).to.eql(true);
        });

        it('returns false', function() {
          const json = {
            user: {
              roles: ['Admin'],
            },
          };
          const query = {
            'user.roles': { $in: ['Owner'] },
          };

          const result = isJsonValid(json, query);

          expect(result).to.eql(false);
        });
      });

      context('when the reference is not an array', function() {
        it('returns true', function() {
          const json = {
            user: {
              _id: '123',
            },
          };
          const query = {
            'user._id': { $in: ['123'] },
          };

          const result = isJsonValid(json, query);

          expect(result).to.eql(true);
        });

        it('returns false', function() {
          const json = {
            user: {
              _id: '123',
            },
          };
          const query = {
            'user._id': { $in: [123] },
          };

          const result = isJsonValid(json, query);

          expect(result).to.eql(false);
        });
      });
    });

    describe('inferred value', function() {
      it('returns true', function() {
        const json = {
          record: {
            userId: '123',
          },
          user: {
            _id: '123',
          },
        };
        const query = {
          'record.userId': { $eq: { $ref: 'user._id' } },
        };

        const result = isJsonValid(json, query);

        expect(result).to.eql(true);
      });

      it('returns false', function() {
        const json = {
          record: {
            userId: '123',
          },
          user: {
            _id: '12345',
          },
        };
        const query = {
          'record.userId': { $eq: { $ref: 'user._id' } },
        };

        const result = isJsonValid(json, query);

        expect(result).to.eql(false);
      });
    });
  });
});