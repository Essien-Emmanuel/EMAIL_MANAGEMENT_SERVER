const router = require('express').Router();
const { EmailTagService } = require('../services/user/emailTag');
const defineController = require('../core/defineController');

const { getTag, createTag, updateTag, deleteTag } = EmailTagService;

router.get('/', defineController({
  async controller(req) {
    const response = await getTag(req.query.tagId);
    req.return(response);
  }
}))