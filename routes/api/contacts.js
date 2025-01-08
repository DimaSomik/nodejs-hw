const express = require('express')
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact, } = require('../../models/contacts');

const { checkContact } = require('../../models/validation')

const router = express.Router()

router.get('/', listContacts);

router.get('/:id', getContactById);

router.post('/', checkContact, addContact);

router.delete('/:id', removeContact);

router.put('/:id', checkContact, updateContact);

module.exports = router
