const router = require('express').Router();
const defineController = require('../core/defineController');
const { TemplateService } = require('../services/user/template');

const { createTemplate, getTemplate } = TemplateService;

router.get('/get', defineController({
  async controller(req) {
    const response = await getTemplate(req.query.templateId);
    req.return(response);
  }
}));

router.post('/create', defineController({
  async controller(req) {
    const userId = req.query.userId;
    const template = req.body;
    const response = await createTemplate(userId, template);
    req.return(response)
  }
}));

exports.router = router;