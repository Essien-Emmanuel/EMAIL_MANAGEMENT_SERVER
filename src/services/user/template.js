const {User} = require('../../database/repositories/user.repo');
const {Template} = require('../../database/repositories/template.repo');
const { NotFoundError, InternalServerError } = require('../../libs/exceptions');
const { extractPlaceholders } = require('../../utils/index');

class TemplateService {
  static async createTemplate(userId, templateDto) {
    const { slug } = templateDto;

    const user = await User.getById(userId);
    if (!user) throw new NotFoundError('User Not Found!');

    const template = await Template.getBySlug(slug);
    if (template) throw new Error('Template Already Exist! Go to edit to make desired changes!');

    const extractedPersonalizedVariables = extractPlaceholders(templateDto.text); 

    const createdTemplate = await Template.create({...
      templateDto, 
      personalizedVariables: extractedPersonalizedVariables,       
      user: userId
    });
    if (!createdTemplate) throw new InternalServerError('Unable to create Template');

    // const generatedTemplate = generateEmailTemplate({subject, greeting, message});

    return {
      statusCode: 201,
      message: 'Template created successfully!',
      data: { createdTemplate, }
    }
  }

  static async getTemplate(id) {
    const template = await Template.getById(id);
    if (!template) throw new NotFoundError('Template not found!');

    return {
      message: 'Fetched template successfully!',
      data: { emailTemplate: template }
    }
  }

  static async updateTemplate(filter, updateDto) {
    const { templateId: _id} = filter;

    const template = await Template.getById(_id);
    if (!template) throw new NotFoundError('Template Not Found!');

    let updatedTemplate = await Template.update({ _id }, updateDto);
    if (updatedTemplate.modifiedCount !== 1) throw new InternalServerError('Unable to update template.');
    
    updatedTemplate = await Template.getById(_id);

    return {
      message: 'Template variables updated successfully!',
      data: { updatedTemplate }
    }
  }

  static async deleteTemplate(id) {
    const template = await Template.getById(id);
    if (!template) throw new NotFoundError('Template Not Found!');

    const deletedTemplate = await Template.delete(id);
    if (deletedTemplate.deletedCount !== 1) throw new InternalServerError('Unable to delete template!');

    return {
      message: 'Template deleted successfully!',
      data: { deletedTemplateId: id }
    }
  }
}

exports.TemplateService = TemplateService;