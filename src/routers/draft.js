const router = require("express").Router();
const defineController = require("../core/defineController");
const { DraftService } = require("../services/user/draft");

const { getAllDrafts, getDraft } = DraftService;

router.post(
  "/get-all",
  defineController({
    async controller(req) {
      const response = await getAllDrafts();
      req.return?.(response);
    },
  })
);

router.post(
  "/get",
  defineController({
    async controller(req) {
      const response = await getDraft();
      req.return?.(response);
    },
  })
);
