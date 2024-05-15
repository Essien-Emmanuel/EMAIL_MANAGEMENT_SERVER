const router = require('express').Router();
const defineController = require('../../core/defineController')

class GenericConfigRouter {
  constructor(service) {
    this.service = service;
    this.router = router;
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get('/get', defineController({
      async controller(req) {
        const response = await this.service.getRecord(req.query.credentialId);
        req.return(response);
      }
    }));
  
    this.router.post('/create', defineController({
      controller: async (req) => {
        const response = await this.service.createRecord({
          userId: req.query.userId, 
          serviceProviderId: req.query.serviceProviderId,
          ...req.body});
        req.return(response);
      }
    }));
  
    this.router.put('/update', defineController({
      async controller(req) {
        const response = await this.service.updateRecord({_id: req.query.credentialId}, { ...req.body });
        req.return(response);
      }
    }));
  
    this.router.delete('/delete', defineController({
      async controller(req) {
        const response = await this.service.deleteRecord(req.query.credentialId);
        req.return(response);
      }
    }));
  }

  getRouter() {
    return this.router
  }
}

exports.GenericConfigRoutes = GenericConfigRouter;