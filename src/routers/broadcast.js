const router = require('express').Router();

const defineController = require('../core/defineController');
const { BroadcastService } = require('../services/user/broadcast');

const { sendBroadcast } = BroadcastService;

router.post('/send', defineController({
    async controller(req) {
        const response = await sendBroadcast({});
        req.return(response); 
    }
}));

exports.broadcastRoutes = router;