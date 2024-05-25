const router = require('express').Router();

const { ServiceProviderService } = require('../services/user/serviceProvider');
const defineController = require('../core/defineController');
const { validateInput } = require('../validation/index');
const { 
  createServiceProviderSchema, 
  updateServiceProviderSchema, 
  serviceProviderIdSchema 
} = require('../validation/schemas/serviceProvider');

const { createServiceProvider, getServiceProvider, updateServiceProvider, deleteServiceProvider } = ServiceProviderService;

router.get('/get',
  serviceProviderIdSchema,
  validateInput,
  defineController({
    async controller(req) {
      const response = await getServiceProvider(req.query.serviceProviderId);
      req.return(response);
    }
}));

router.post('/create', 
  createServiceProviderSchema, 
  validateInput,
  defineController({
  async controller(req) {
    const response = await createServiceProvider({ ...req.body});
    req.return(response);
  }
}));

router.put('/update',
  updateServiceProviderSchema,
  validateInput,
  defineController({
    async controller(req) {
      const response = await updateServiceProvider({ serviceProviderId: req.query.serviceProviderId}, req.body);
      req.return(response);
  }
}));

router.delete('/delete',
  serviceProviderIdSchema,
  validateInput,
  defineController({
    async controller(req) {
      const response = await deleteServiceProvider(req.query.serviceProviderId);
      req.return(response);
    }
}));

exports.serviceProviderRoutes = router;