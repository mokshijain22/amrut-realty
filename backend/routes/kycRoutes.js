const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { requireAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/', requireAuth, upload.array('docs', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'At least one document is required' });
    }
    const docUrls = req.files.map((f) => `/uploads/kyc/${f.filename}`);

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        $push: { kycDocs: { $each: docUrls } },
        $set: { kycStatus: 'pending' },
      },
      { new: true }
    ).select('-passwordHash');

    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;