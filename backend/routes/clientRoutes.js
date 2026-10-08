const express = require('express');
const router = express.Router();
const {
  getClients,
  createClient,
  updateClient,
  deleteClient,
} = require('../controllers/clientController');
const { protect } = require('../middleware/authMiddleware');
const {
  createClientValidation,
  updateClientValidation,
} = require('../middleware/validatorMiddleware');

router.use(protect);

router.route('/')
  .get(getClients)
  .post(createClientValidation, createClient);

router.route('/:id')
  .put(updateClientValidation, updateClient)
  .delete(deleteClient);

module.exports = router;
