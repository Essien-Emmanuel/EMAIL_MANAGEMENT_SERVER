const router = require("express").Router();

const defineController = require("../core/defineController");
const { BroadcastService } = require("../services/user/broadcast");
const { validateInput } = require("../validation");
const {
  userIdSchema,
  sendBroadcastSchema,
} = require("../validation/schemas/broadcast");

const {
  sendBroadcast,
  getAllBroadcasts,
  getBroadcast,
  editBroadcast,
  deleteBroadcast,
  duplicateBroadCast,
  unscheduleBroadcast,
} = BroadcastService;

router.post(
  "/send",
  // userIdSchema,
  // validateInput,
  // sendBroadcastSchema,
  // validateInput,
  defineController({
    async controller(req) {
      const {
        email,
        subject,
        sendingFrom,
        sendingTo,
        publishStatus,
        scheduledTime,
      } = req.body;
      const response = await sendBroadcast(req.query.userId, {
        email,
        subject,
        sendingFrom,
        sendingTo,
        publishStatus,
        scheduledTime,
      });
      req.return(response);
    },
  })
);

router.post(
  "/duplicate",
  defineController({
    async controller(req) {
      const response = await duplicateBroadCast(req.query.broadcastId);
      req.return?.(response);
    },
  })
);

router.post(
  "/unschedule",
  defineController({
    async controller(req) {
      const response = await unscheduleBroadcast(req.query.broadcastId);
      req.return?.(response);
    },
  })
);

router.get(
  "/get-one",
  defineController({
    async controller(req) {
      const response = await getBroadcast(req.query.broadcastId);
      req.return?.(response);
    },
  })
);

router.get(
  "/get-all",
  defineController({
    async controller(req) {
      const response = await getAllBroadcasts(req.query.userId);
      req.return?.(response);
    },
  })
);

router.put(
  "/edit",
  defineController({
    async controller(req) {
      const response = await editBroadcast(req.query.broadcastId, req.body);
      req.return?.(response);
    },
  })
);

router.delete(
  "/delete",
  defineController({
    async controller(req) {
      const response = await deleteBroadcast(req.query.broadcastId);
      req.return?.(response);
    },
  })
);

exports.broadcastRoutes = router;
