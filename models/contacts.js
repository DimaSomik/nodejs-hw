const { 
  showContacts,
  contactById,
  deleteContact,
  newContact,
  updContact, } = require('./helpAPI.js');

const listContacts = async (req, res) => {
  try {
    const contacts = await showContacts();
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({msg: error.message});
  }
}

const getContactById = async (req, res) => {
  try {
    const contact = await contactById(req.params.id)
    if (!contact) {
      return res.status(404).json({msg: "Not Found"});
    }
    res.status(200).json(contact);
  } catch (error) {
    res.status(500).json({msg: error.message, msg2: req.params.id});
  }
}

const removeContact = async (req, res) => {
  try {
    const contact = await deleteContact(req.params.id)
    if (!contact) {
      return res.status(404).json({msg: "Not Found"});
    }
    res.status(200).json({msg: "contact deleted"});
  } catch (error) {
    res.status(500).json({msg: error.message});
  }
}

const addContact = async (req, res) => {
  try {
    const contact = await newContact(req.body);
    res.status(201).json(contact);
  } catch (error) {
    res.status(500).json({msg: error.message});
  }
}

const updateContact = async (req, res) => {
  try {
    if (Object.keys(req.body).length === 0) {
      res.status(400).json({msg: "missing fields"});
    }

    const alteredContact = await updContact(req.params.id, req.body);
    if(!alteredContact) {
      res.status(404).json({msg: "Not Found"});
    }

    res.status(200).json(alteredContact);
  } catch (error) {
    res.status(500).json({msg: error.message});
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
