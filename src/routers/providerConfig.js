const router = require('express').Router();
const defineController = require('../core/defineController');
const { ProviderConfigService } = require('../services/providerConfig/index');
const { validateInput } = require('../validation');
const { createProviderConfigSchema, createProviderConfigIdSchema, providerConfigIdSchema, updateProviderConfigSchema } = require('../validation/schemas/providerConfig/index');

const { getProviderConfig, createProviderConfig, updateProviderConfig, deleteProviderConfig } = ProviderConfigService;

router.get('/get', defineController({
  async controller(req) {
    const response = await getProviderConfig(req.query.providerConfigId);
    req.return(response);
  }
}));

router.post('/create',
  createProviderConfigIdSchema,
  validateInput,
  createProviderConfigSchema,
  validateInput, 
  defineController({
    async controller(req) {
      const response = await createProviderConfig({
        userId: req.query.userId, 
        serviceProviderId: req.query.serviceProviderId,
        ...req.body});
      req.return(response);
    }
}));

router.put('/update', 
  providerConfigIdSchema,
  validateInput,
  updateProviderConfigSchema,
  validateInput,
  defineController({
    async controller(req) {
      const response = await updateProviderConfig({_id: req.query.providerConfigId}, { ...req.body });
      req.return(response);
    }
}));

router.delete('/delete', 
  providerConfigIdSchema,
  validateInput,
  defineController({
    async controller(req) {
      const response = await deleteProviderConfig(req.query.providerConfigId);
      req.return(response);
    }
}));

exports.providerConfigRoutes = router;