const { User } = require('../../database/repositories/user.repo');
const { Tag } = require('../../database/repositories/tag.repo');
const { ResourceConflictError, InternalServerError, NotFoundError } = require('../../libs/exceptions');

class TagService {
  static async createTag(userId, tagDto) {
    const user = await User.getById(userId);
    if (!user) throw new NotFoundError('User Not Found!');

    const tag = await Tag.getBySlug(tagDto.slug);
    if (tag) throw new ResourceConflictError('Email Tag Already Exists.');

    const createdTag = await Tag.create({...tagDto, user: userId});
    if (!createdTag) throw new InternalServerError('Unable to create Email Tag.');

    return {
      statusCode: 201,
      message: "Created New Email Tag Successfully.",
      data: { createdTag }
    }
  }

  static async getTag(_id) {
    const tag = await Tag.getById(_id);
    if (!tag) throw new NotFoundError('Email Tag Not Found.');

    return {
      data: { tag }
    }
  }

  static async updateTag(_id, updateDto) {
    const tag = await Tag.getById(_id);
    if (!tag) throw new NotFoundError("Email Tag Not Found");
    
    let updatedTag = await Tag.update({ _id }, updateDto);
    if (updatedTag.modifiedCount !== 1) throw new InternalServerError('Unable to update Email Tag.');
    
    updatedTag = await Tag.getById(_id);

    return {
      message: 'Email Tag updated successfully!',
      data: { updatedTag }
    };
  }

  static async deleteTag(_id) {
    const tag = await Tag.getById(_id);
    if (!tag) throw new NotFoundError('Email Tag Not Found!');

    const deletedTag = await Tag.delete(_id);
    if (deletedTag.deletedCount !== 1) throw new InternalServerError('Unable to delete email tag.');

    return {
      message: 'Email Tag deleted successfully!',
      data: { deletedTagId: _id }
    }
  }
}

exports.TagService = TagService;