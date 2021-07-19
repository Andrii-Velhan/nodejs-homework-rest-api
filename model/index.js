const fs = require('fs/promises');
// const contacts = require('./contacts.json');
const path = require('path');

const contactsPath = path.join(__dirname, './contacts.json');

const listContacts = async () => {
  try {
    const data = await fs.readFile(contactsPath, 'utf8');

    return JSON.parse(data);
  } catch (err) {
    console.log(err);
  }
};

const getContactById = async (contactId) => {
  try {
    const data = await fs.readFile(contactsPath);

    return JSON.parse(data).find((user) => String(user.id) === contactId);
  } catch (err) {
    console.log(err);
  }
};

const removeContact = async (contactId) => {
  try {
    const data = await fs.readFile(contactsPath, 'utf8');
    const users = JSON.parse(data);
    const filtredUsers = users.find((user) => String(user.id) === contactId);
    const newData = users.filter((user) => String(user.id) !== contactId);

    await fs.writeFile(contactsPath, JSON.stringify(newData, 'utf8'));

    return filtredUsers;
  } catch (err) {
    console.log(err);
  }
};

const addContact = async (body) => {
  const { name, email, phone } = body;
  const newContact = {
    id: Date.now(),
    name,
    email,
    phone,
  };
  try {
    const data = await fs.readFile(contactsPath, 'utf8');
    const users = [...JSON.parse(data), newContact];
    await fs.writeFile(contactsPath, JSON.stringify(users, 'utf8'));

    return newContact;
  } catch (err) {
    console.log(err);
  }
};

const updateContact = async (contactId, body) => {
  try {
    const data = await fs.readFile(contactsPath);
    const contacts = JSON.parse(data);

    const contact = contacts.find(
      (contact) => String(contact.id) === contactId
    );

    // const newContact = contacts.assign(contact, body)
    const newContact = { ...contact, ...body };

    contacts.forEach((item, i) => {
      if (String(item.id) === contactId) contacts[i] = newContact;
    });

    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, '\t'));

    return newContact.id ? newContact : null;
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
