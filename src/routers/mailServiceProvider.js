const router = require('express').Router();
const { MailServiceProviderService } = require('../services/user/MailServiceProvider');
const defineController = require('../core/defineController');

const { createMSProvider, getMSProvider, updateMSProvider, deleteMSProvider } = MailServiceProviderService;

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

router.put('/update', defineController({
  async controller(req) {
    const response = await updateMSProvider({ serviceProviderId: req.query.serviceProviderId}, req.body);
    req.return(response);
  }
}));

router.delete('/delete', defineController({
  async controller(req) {
    const response = await deleteMSProvider(req.query.serviceProviderId);
    req.return(response);
  }
}));

exports.mailServiceProviderRoutes = router;