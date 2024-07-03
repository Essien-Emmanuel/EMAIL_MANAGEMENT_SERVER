const router = require('express').Router();
const defineController = require('../core/defineController');
const { uploadSingleFile } = require('../libs/fileUploads');
const { SubscriberService } = require('../services/user/subscriber');

const { confirmSubscriptionRequest, importSubscribersFromCsv, addSubscriber } = SubscriberService; 


router.put('/request/confirm', defineController({
    async controller(req) {
        const response = await confirmSubscriptionRequest(req.query.recipientId);
        req.return(response)
    }
}));

router.post('/csv-import', uploadSingleFile('file'), defineController({
    async controller(req) {
        const response = await importSubscribersFromCsv(req.query.userId, req.file.buffer)
        req.return(response);
    }
}));

router.post('/add-one', defineController({
    async controller(req) {
        const response = await addSubscriber(req.query.userId, req.body);
        req.return?.(response)
    }
}))

exports.subsciberRoutes = router;