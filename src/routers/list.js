const router = require('express').Router();

const defineController = require('../core/defineController');
const { ListService } = require('../services/user/list');

const { createList, addSubscribersToList, getList, updateList, deleteList } = ListService;

router.post('/create', defineController({
    async controller(req) {
        const response = await createList(req.query.userId, req.body);
        req.return?.(response);
    }
}));

router.get('/get', defineController({
    async controller(req) {
        const response = await getList(req.query.listId);
        req.return?.(response);
    }
}));

router.put('/add-subscribers', defineController({
    async controller(req) {
      const response = await addSubscribersToList(req.query.listId, req.body.subscribers);
      req.return(response);
    }
}));

router.put('/update', defineController({
    async controller(req) {
      const response = await updateList(req.query.listId, req.body);
      req.return(response);
    }
  }));
  
  router.delete('/delete', defineController({
    async controller(req) {
      const response = await deleteList(req.query.listId);
      req.return(response);
    }
  }));

exports.listRoutes = router;