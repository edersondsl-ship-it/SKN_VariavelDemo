const express = require('express');
const router  = express.Router();
const store   = require('../store');

router.get('/', (req, res) => {
  res.json(store.listDosadores());
});

module.exports = router;
