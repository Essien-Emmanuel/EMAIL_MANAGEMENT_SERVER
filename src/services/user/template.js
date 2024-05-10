const {User} = require('../../database/repositories/user.repo');
const {Template} = require('../../database/repositories/template.repo');
const { NotFoundError, InternalServerError } = require('../../libs/exceptions');
const { generateEmailTemplate } = require('../../libs/mailer/template');

class TemplateService {
  static async createTemplate(userId, templateDto) {
    const { slug, subject, message, greeting } = templateDto;

    const user = await User.getById(userId);
    if (!user) throw new NotFoundError('User Not Found!');

    const template = await Template.getBySlug(slug);
    if (template) throw new Error('Template Already Exist! Go to edit to make desired changes!');

    const createdTemplate = await Template.create({...templateDto, user: userId});
    if (!createdTemplate) throw new InternalServerError('Unable to create Template');
    const generatedTemplate = generateEmailTemplate({subject, greeting, message});

    return {
      message: 'Template created successfully!',
      data: { createdTemplate, generatedTemplate }
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
}

exports.TemplateService = TemplateService;