const router = require('express').Router();
const { TagService } = require('../services/user/tag');
const defineController = require('../core/defineController');
const { createTagSchema } = require('../validation/schemas/tag');

const { getTag, createTag, updateTag, deleteTag } = TagService;

router.get('/get', defineController({
  async controller(req) {
    const response = await getTag(req.query.tagId);
    req.return(response);
  }
}));

router.post('/create',
  createTagSchema,
  defineController({
    async controller(req) {
      const response = await createTag(req.query.userId, req.body);
      req.return(response);
}
}));

router.put('/update', defineController({
  async controller(req) {
    const response = await updateTag(req.query.tagId, req.body);
    req.return(response);
  }
}));

router.delete('/delete', defineController({
  async controller(req) {
    const response = await deleteTag(req.query.tagId);
    req.return(response);
  }
}));

exports.tagRoutes = router;