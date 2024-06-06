const { recipientModel } = require('../models/Recipient');
const { GenericRepo } = require('./generic');

const RecipientRepo = new GenericRepo(recipientModel);

exports.Recipient = RecipientRepo;
