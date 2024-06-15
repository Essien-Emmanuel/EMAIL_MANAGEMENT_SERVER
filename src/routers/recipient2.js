const router = require('express').Router();

const defineController = require('../core/defineController');
const { RecipientService }  = require('../services/user/recipient2');

const { addRecipient } = RecipientService;

router.post('/add', defineController({
  async controller(req) {
    const { first_name, email } = req.body;
    const response = await addRecipient({ first_name, email});
    req.return(response);
  }
}))