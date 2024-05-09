const router = require('express').Router();
const defineController = require('../core/defineController');
const { TemplateService } = require('../services/user/template');

const { createTemplate } = TemplateService;

router.post('/template/create', defineController({
  async controller(req) {
    const userId = req.query.userId;
    const template = req.body;
    const response = await createTemplate(userId, template);
    req.return(response)
  }
}));

exports.router = router;