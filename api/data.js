const { MongoClient } = require('mongodb');

let cachedClient = null;
async function getClient() {
  if (cachedClient) return cachedClient;
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  cachedClient = client;
  return client;
}

module.exports = async function handler(req, res) {
  try {
    const client = await getClient();
    const db = client.db('krishnaUniverse');
    const collection = db.collection('storage');

    if (req.method === 'GET') {
      const key = req.query.key;
      if (!key) return res.status(400).json({ error: 'key required' });
      const doc = await collection.findOne({ _id: key });
      return res.status(200).json({ value: doc ? doc.value : null });
    }

    if (req.method === 'POST') {
      const { key, value } = req.body;
      if (!key) return res.status(400).json({ error: 'key required' });
      await collection.updateOne({ _id: key }, { $set: { value } }, { upsert: true });
      return res.status(200).json({ ok: true });
    }

    res.status(405).json({ error: 'method not allowed' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
};
