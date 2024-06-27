const { User } = require('../../database/repositories/user.repo');
const { List } = require('../../database/repositories/list.repo');
const { ResourceConflictError, InternalServerError, NotFoundError } = require('../../libs/exceptions');
const { normalizeString } = require('../../utils');

class ListService {
  static async createList(userId, listDto) {
    const user = await User.getById(userId);
    if (!user) throw new NotFoundError('User Not Found!');

    const listName = normalizeString(listDto.name).toLowerCase()

    const list = await List.getByName(listName);
    if (list) throw new ResourceConflictError('Email List Already Exists.');

    const listData = { ...listDto, name: listName }
    
    const createdList = await List.create({...listData, user: userId});
    if (!createdList) throw new InternalServerError('Unable to create Email List.');

    return {
      statusCode: 201,
      message: "Created New Email List Successfully.",
      data: { createdList }
    }
  }

  static async getList(_id) {
    const list = await List.getById(_id);
    if (!list) throw new NotFoundError('Email List Not Found.');

    return {
      data: { list }
    }
  }

  static async updateList(_id, updateDto) {
    const list = await List.getById(_id);
    if (!list) throw new NotFoundError("Email List Not Found");
    
    let updatedList = await List.update({ _id }, updateDto);
    if (updatedList.modifiedCount !== 1) throw new InternalServerError('Unable to update Email List.');
    
    updatedList = await List.getById(_id);

    return {
      message: 'Email List updated successfully!',
      data: { updatedList }
    };
  }

  static async deleteList(_id) {
    const list = await List.getById(_id);
    if (!list) throw new NotFoundError('Email List Not Found!');

    const deletedList = await List.delete(_id);
    if (deletedList.deletedCount !== 1) throw new InternalServerError('Unable to delete email List.');

    return {
      message: 'Email List deleted successfully!',
      data: { deletedListId: _id }
    }
  }
}

exports.ListService = ListService;