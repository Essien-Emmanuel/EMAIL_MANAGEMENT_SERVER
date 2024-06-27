const {User} = require('../../database/repositories/user.repo');
const {Template} = require('../../database/repositories/template.repo');
const { NotFoundError, InternalServerError, ResourceConflictError } = require('../../libs/exceptions');
const { extractPlaceholders, parseVariablePaths } = require('../../utils/index');

class TemplateService {
  static async createTemplate(userId, templateDto) {
    const { name, textContent, htmlContent, subjectLine } = templateDto;
    const template = await Template.getByNameAndContent({ name, textContent });
    if (template) throw new ResourceConflictError('Template already exists.');

    let variables;
    const tableNameAndField = parseVariablePaths(textContent);
    if (tableNameAndField.length > 0) {
      variables = tableNameAndField.map(variableArr => variableArr[1]);
    }
    const personalizedVariables = variables ? { personalized_variables: variables} : { personalized_variables: []};

    const newTemplate = await Template.create({ 
      ...templateDto,
      subject_line: subjectLine,
      text_content: textContent,
      html_content: htmlContent,  
      ...personalizedVariables,
      user: userId
    });
    if (!newTemplate) throw new InternalServerError('Unable to save template.');

    return {
      statusCode: 201,
      message: 'Template created successfully!',
      data: { newTemplate }
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