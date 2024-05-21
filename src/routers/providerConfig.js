const router = require('express').Router();
const defineController = require('../core/defineController');
const { ProviderConfigService } = require('../services/providerConfig/index');

const { getProviderConfig, createProviderConfig, updateProviderConfig, deleteProviderConfig } = ProviderConfigService;

router.get('/get', defineController({
  async controller(req) {
    const response = await getProviderConfig(req.query.providerConfigId);
    req.return(response);
  }
}));

router.post('/create', defineController({
  async controller(req) {
    const response = await createProviderConfig({
      userId: req.query.userId, 
      serviceProviderId: req.query.serviceProviderId,
      ...req.body});
    req.return(response);
  }
}));

router.put('/update', defineController({
  async controller(req) {
    const response = await updateProviderConfig({_id: req.query.providerConfigId}, { ...req.body });
    req.return(response);
  }
}));

router.delete('/delete', defineController({
  async controller(req) {
    const response = await deleteProviderConfig(req.query.providerConfigId);
    req.return(response);
  }
}));

exports.providerConfigRoutes = router;