const router = require('express').Router();
const defineController = require('../core/defineController');
const { MailService } = require('../services/user/mail');

const { sendMail } = MailService;

router.post('/mail', defineController({
  async controller(req) {
    const { recipients, variables, userId, templateId, serviceProviderId } = req.body;
    const response = await sendMail({ userId, recipients, variables, templateId, serviceProviderId });
    req.return(response);
  }
}));

exports.mailRoutes = router;