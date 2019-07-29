module.exports = {
  async up(db) {
    const collection = db.collection('refreshtokens');

    await collection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
    await collection.createIndex({ jti: 1 }, { unique: true });
    await collection.createIndex({ userId: 1 });
  },

  async down(db) {
    const collection = db.collection('refreshtokens');

    await collection.dropIndex('expiresAt_1');
    await collection.dropIndex('jti_1');
    await collection.dropIndex('userId_1');
  },
};