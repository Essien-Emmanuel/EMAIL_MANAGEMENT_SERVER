const router = require('express').Router();

const defineController = require('../core/defineController');
const { ListService } = require('../services/user/list');

const { createList } = ListService;

router.post('/create', defineController({
    async controller(req) {
        const response = await createList(req.query.userId, req.body);
        req.return?.(response);
    }
}));

exports.listRoutes = router;