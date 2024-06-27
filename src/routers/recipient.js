const router = require('express').Router();

const defineController = require('../core/defineController');
const { RecipientService }  = require('../services/user/recipient');

const { addRecipient } = RecipientService;

router.post('/add', defineController({
  async controller(req) {
    const { first_name, email } = req.body;
    const response = await addRecipient( req.query.userId, { first_name, email});
    req.return(response);
  }
}));

exports.recipientRoutes = router;