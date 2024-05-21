const router = require('express').Router();
const { ServiceProviderService } = require('../services/user/serviceProvider');
const defineController = require('../core/defineController');

const { createServiceProvider, getServiceProvider, updateServiceProvider, deleteServiceProvider } = ServiceProviderService;

router.get('/get', defineController({
  async controller(req) {
    const response = await getServiceProvider(req.query.serviceProviderId);
    req.return(response);
  }
}));

router.post('/create', defineController({
  async controller(req) {
    const response = await createServiceProvider({ ...req.body});
    req.return(response);
  }
}));

router.put('/update', defineController({
  async controller(req) {
    const response = await updateServiceProvider({ serviceProviderId: req.query.serviceProviderId}, req.body);
    req.return(response);
  }
}));

router.delete('/delete', defineController({
  async controller(req) {
    const response = await deleteServiceProvider(req.query.serviceProviderId);
    req.return(response);
  }
}));

exports.serviceProviderRoutes = router;