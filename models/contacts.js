const Contacts = require('./schema.js');

const listContacts = async (_, res, next) => {
  try {
    const contacts = await Contacts.find();
    res.json({
      status: 'success',
      code: 200,
      data: {
        result: contacts,
      },
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const getContactById = async (req, res, next) => {
  try {
    const contact = await Contacts.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({msg: "Not Found"});
    }
    res.json({
      status: 'success',
      code: 200,
      data: {
        result: contact,
      },
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const removeContact = async (req, res, next) => {
  try {
    const contact = await Contacts.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({msg: "Not Found"});
    }
    res.json({
      status: 'success',
      code: 200,
      data: {
        result: contact,
      },
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const addContact = async (req, res, next) => {
  try {
    const contact = await Contacts.create(req.body);
    res.json({
      status: 'success',
      code: 201,
      data: {
        result: contact,
      },
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const contact = await Contacts.findByIdAndUpdate(req.params.id,
                                                     req.body,
                                                     { new: true });
    if (!contact) {
      return res.status(404).json({msg: "Not Found"});
    }
    res.json({
      status: 'success',
      code: 200,
      data: {
        result: contact,
      },
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const updateFavorite = async (req, res, next) => {
  try {
    const fav = req.body;
    if (fav === undefined) {
      return res.status(400).json({msg: "missing field favorite"});
    };
    const contact = await Contacts.findByIdAndUpdate(req.params.id,
                                                     req.body,
                                                     { new: true });
    if (!contact) {
      return res.status(404).json({msg: "Not Found"});
    }
    res.json({
      status: 'success',
      code: 200,
      data: {
        result: contact,
      },
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateFavorite,
}
