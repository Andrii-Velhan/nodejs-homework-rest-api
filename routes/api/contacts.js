const express = require('express');
const router = express.Router();

const Joi = require('joi');
const Controller = require('../../model/index');

const validationSchemaPOST = Joi.object({
  name: Joi.string().alphanum().min(3).max(15).required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net'] },
    })
    .required(),
  phone: Joi.string()
    .max(12)
    .pattern(/\+?[0-9\s\-\\)]+/)
    .required(),
});

const validationSchemaPATCH = Joi.object({
  name: Joi.string().alphanum().min(3).max(15),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ['com', 'net'] },
  }),
  phone: Joi.string()
    .max(12)
    .pattern(/\+?[0-9\s\-\\)]+/),
}).min(1);

router.get('/', async (req, res, next) => {
  try {
    const contacts = await Controller.listContacts();
    return res.status(200).json(contacts);
  } catch (err) {
    next(err);
  }
});

router.get('/:contactId', async (req, res, next) => {
  try {
    const contact = await Controller.getContactById(req.params.contactId);
    if (!contact) {
      return res.status(404).json({ message: 'Not found' });
    } else return res.status(200).json({ contact });
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  const dataValidate = validationSchemaPOST.validate(req.body);
  if (dataValidate.error) {
    return res
      .status(404)
      .json({ message: 'missing required name field or validation error' });
  }

  const newContact = await Controller.addContact(req.body);
  res.status(201).json(newContact);
});

router.delete('/:contactId', async (req, res, next) => {
  try {
    const contact = await Controller.removeContact(req.params.contactId);
    if (!contact) {
      return res.status(404).json({ message: 'Not found' });
    } else return res.status(200).json({ message: 'contact deleted' });
  } catch (err) {
    next(err);
  }
});

router.patch('/:contactId', async (req, res, next) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: 'missing fields' });
    }

    const dataValidate = validationSchemaPATCH.validate(req.body);

    if (dataValidate.error) {
      return res
        .status(404)
        .json({ message: `Validate error: ${dataValidate.error.message}` });
    }

    const contact = await Controller.updateContact(
      req.params.contactId,
      req.body
    );
    if (!contact) {
      return res.status(404).json({ message: 'Not found' });
    } else return res.status(200).json({ contact });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
