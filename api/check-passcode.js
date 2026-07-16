module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'method not allowed' });
  }
  const { passcode } = req.body || {};
  const correct = passcode && passcode === process.env.SITE_PASSCODE;
  res.status(200).json({ ok: !!correct });
};
