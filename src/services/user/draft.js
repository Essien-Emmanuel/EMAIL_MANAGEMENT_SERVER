const { Draft } = require("../../database/repositories/draft.repo");
const { NotFoundError } = require("../../libs/exceptions");

class DraftService {
  static async getAllDrafts(userId) {
    const drafts = await Draft.getAll({ user: userId });

    return {
      message: "Fetched all drafts successfully",
      data: { drafts },
    };
  }

  static async getDraft(draftId) {
    const draft = await Draft.getById(draftId);
    if (!draft) throw new NotFoundError("Draft not found");

    return {
      message: "Fetched one draft successfully",
      data: { draft },
    };
  }
}

exports.DraftService = DraftService;
