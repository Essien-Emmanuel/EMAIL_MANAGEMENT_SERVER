const router = require('express').Router();
const defineController = require('../core/defineController');
const { TemplateService } = require('../services/user/template');

const { createTemplate, getTemplate, updateTemplate, deleteTemplate } = TemplateService;

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

router.put('/update', defineController({
  async controller(req) {
    const templateId = req.query.templateId;
    const updateData = req.body;
    const response = await updateTemplate({ templateId }, updateData);
    req.return(response);
  }
}));

router.delete('/delete', defineController({
  async controller(req) {
    const response = await deleteTemplate(req.query.templateId);
    req.return(response);
  }
}))

exports.router = router;