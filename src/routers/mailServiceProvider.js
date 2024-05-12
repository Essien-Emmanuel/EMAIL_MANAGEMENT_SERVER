const router = require('express').Router();
const { MailServiceProviderService } = require('../services/user/MailServiceProvider');
const defineController = require('../core/defineController');

const { createMSProvider, getMSProvider } = MailServiceProviderService;

router.get('/get', defineController({
  async controller(req) {
    const response = await getMSProvider(req.query.serviceProviderId);
    req.return(response);
  }
}));

router.post('/create', defineController({
  async controller(req) {
    const response = await createMSProvider({ ...req.body});
    req.return(response);
  }
}));

exports.mailServiceProviderRoutes = router;