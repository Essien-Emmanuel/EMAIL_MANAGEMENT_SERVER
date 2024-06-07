const router = require('express').Router();
const { RecipientService } = require('../services/user/recipient');
const defineController = require('../core/defineController');
const { uploadSingleFile } = require('../libs/fileUploads/index');

const { 
  getRecipient, 
  getRecipients, 
  saveRecipients, 
  saveRecipientsByTagId,
  saveRecipientsFromXlForOneTag,
  saveRecipientsFromCsvForOneTag, 
  updateRecipient, 
  deleteRecipient 
} = RecipientService;

router.get('/get-one', defineController({
  async controller(req) {
    const response = await getRecipient(req.query.tagId, req.query.recipientId);
    req.return(response);
  }
}));

router.get('/get-all', defineController({
  async controller(req) {
    const response = await getRecipients(req.query.tagId);
    req.return(response);
  }
}));

router.post('/add', defineController({
  async controller(req) {
    const response = await saveRecipientsByTagId(req.query.tagId, req.body.recipients);
    req.return(response);
  }
}));

router.post('/upload-email-sheet',
  uploadSingleFile('file'),
  defineController({
    async controller(req) {
      const response = await saveRecipientsFromXlForOneTag(req.query.tagId, req.file.buffer);
      req.return(response);
    }
}));

router.post('/upload-email-csv',
  uploadSingleFile('file'),
  defineController({
    async controller(req) {
      const response = await saveRecipientsFromCsvForOneTag(req.query.tagId, req.file.buffer);
      req.return(response);
    }
}));

router.put('/update', defineController({
  async controller(req) {
    const response = await updateRecipient(req.query.tagId, req.query.recipientId, req.body.newEmail);
    req.return(response);
  }
}));

router.delete('/delete', defineController({
  async controller(req) {
    const response = await deleteRecipient(req.query.tagId, req.query.recipientId);
    req.return(response);
  }
}));

exports.emailRecipientRoutes = router;