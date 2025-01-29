const express = require('express');
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateFavorite } = require('../../controllers/contacts');

const { checkContact } = require('../../validation/validation');
const auth = require('../../validation/authorization');

const router = express.Router();

router.use(auth);

router.get('/', listContacts);

router.get('/:id', getContactById);

router.post('/', checkContact, addContact);

router.delete('/:id', removeContact);

router.put('/:id', checkContact, updateContact);

router.patch('/:id/favorite', updateFavorite);

module.exports = router;
