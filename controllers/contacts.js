const Contacts = require('../models/contactsSchema.js');

const listContacts = async (req, res, next) => {
  try {
    const isFavorite = req.query.favorite;
    if(isFavorite === "true") {
      const favContacts = await Contacts.find({ 'favorite': true});
      return res.json({
        status: 'success',
        code: 200,
        data: {
          result: favContacts,
        },
      });  
    } else if (isFavorite === "false") {
      const notFavContacts = await Contacts.find({ 'favorite': false});
      return res.json({
        status: 'success',
        code: 200,
        data: {
          result: notFavContacts,
        },
      });  
    };

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
