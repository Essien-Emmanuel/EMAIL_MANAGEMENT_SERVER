const router = require('express').Router();
const defineController = require('../core/defineController');
const { MailTrapCredentialService } = require('../services/user/mailTrapCrendential');

const { getCredential, createCredential, updateCredential, deleteCredential } = MailTrapCredentialService;

router.get('/get', defineController({
  async controller(req) {
    const response = await getCredential(req.query.credentialId);
    req.return(response);
  }
}));

router.post('/create', defineController({
  async controller(req) {
    const response = await createCredential({
      userId: req.query.userId, 
      serviceProviderId: req.query.serviceProviderId,
      ...req.body});
    req.return(response);
  }
}));

router.put('/update', defineController({
  async controller(req) {
    const response = await updateCredential({_id: req.query.credentialId}, { ...req.body });
    req.return(response);
  }
}));

router.delete('/delete', defineController({
  async controller(req) {
    const response = await deleteCredential(req.query.credentialId);
    req.return(response);
  }
}));

exports.mailTrapCredentialRoutes = router;