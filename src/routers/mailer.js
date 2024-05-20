const router = require('express').Router();
const defineController = require('../core/defineController');
const { MailerService  } = require('../services/user/mailer');

const { sendMail } = MailerService;

router.post('/send', defineController({
  async controller(req) {
    const { recipients, variables, userId, templateId, serviceProviderId } = req.body;
    const response = await sendMail({ userId, recipients, variables, templateId, serviceProviderId });
    req.return(response);
  }
}));

exports.mailerRoutes = router;