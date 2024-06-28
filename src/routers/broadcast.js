const router = require('express').Router();

const defineController = require('../core/defineController');
const { BroadcastService } = require('../services/user/broadcast');
const { validateInput } = require('../validation');
const { userIdSchema, sendBroadcastSchema } = require('../validation/schemas/broadcast');

const { sendBroadcast, getAllBroadcasts, getBroadcast } = BroadcastService;

router.post('/send', 
    // userIdSchema,
    // validateInput, 
    // sendBroadcastSchema, 
    // validateInput,
    defineController({
    async controller(req) {
        const { email, subject, sendingFrom, sendingTo, publishStatus, scheduledTime } = req.body;
        const response = await sendBroadcast(req.query.userId, { 
            email, subject, sendingFrom, sendingTo, publishStatus, scheduledTime 
        });
        req.return(response); 
    }
}));

router.get('/get-one', defineController({
    async controller(req) {
        const response = await getBroadcast(req.query.broadcastId);
        req.return?.(response)
    }
}));

router.get('/get-all', defineController({
    async controller(req) {
        const response = await getAllBroadcasts(req.query.userId);
        req.return?.(response)
    }
}));
exports.broadcastRoutes = router;