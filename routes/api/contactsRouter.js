const express = require('express');
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateFavorite } = require('../../controllers/contacts');

const { checkContact } = require('../../validation/validation');

const router = express.Router();

router.get('/', listContacts);

router.get('/:id', getContactById);

router.post('/', checkContact, addContact);

router.delete('/:id', removeContact);

router.put('/:id', checkContact, updateContact);

router.patch('/:id/favorite', updateFavorite);

module.exports = router;
