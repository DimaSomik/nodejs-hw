const { v4: uuidv4 } = require("uuid");
const fs = require('fs/promises')
const path = require('path');

const DB_PATH = path.join(__dirname, '/contacts.json');

const showContacts = async () => {
    const data = await fs.readFile(DB_PATH);
    return JSON.parse(data);
};

const contactById = async (contactId) => {
    const contacts = await showContacts();
    return contacts.find((contact) => contact.id === contactId);
};

const deleteContact = async (contactId) => {
    const contacts = await showContacts();
    const indexToDelete = contacts.findIndex((contact) => contact.id === contactId);
    if (indexToDelete === -1) return null;
    const deletedContact = contacts.splice(indexToDelete, 1);
    await fs.writeFile(DB_PATH, JSON.stringify(contacts, null, 2));
    return deletedContact;
};

const newContact = async (body) => {
    const contacts = await showContacts();
    const newContact = {id: uuidv4(), ...body};
    contacts.push(newContact);
    await fs.writeFile(DB_PATH, JSON.stringify(contacts, null, 2));
    return newContact
}

const updContact = async (contactId, body) => {
    const contacts = await showContacts();
    const indexToUpdate = contacts.findIndex((contact) => contact.id === contactId)
    if (indexToUpdate === -1) return null;
    contacts[indexToUpdate] = {...contacts[indexToUpdate], ...body};
    await fs.writeFile(DB_PATH, JSON.stringify(contacts, null, 2));
    return contacts[indexToUpdate];
}

module.exports = {
  showContacts,
  contactById,
  deleteContact,
  newContact,
  updContact,
}
