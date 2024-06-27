const {Template} = require('../../database/repositories/template.repo');
const { NotFoundError, InternalServerError, ResourceConflictError } = require('../../libs/exceptions');
const { getPersonalizedVariables } = require('../utils/index');

class TemplateService {
  static async createTemplate(userId, templateDto) {
    const { name, textContent, htmlContent, subjectLine } = templateDto;
    const template = await Template.getByNameAndContent({ name, textContent });
    if (template) throw new ResourceConflictError('Template already exists.');

    const personalizedVariables = getPersonalizedVariables(textContent);

    const newTemplate = await Template.create({ 
      ...templateDto,
      subject_line: subjectLine,
      text_content: textContent,
      html_content: htmlContent,  
      personalized_variables: personalizedVariables,
      user: userId
    });
    if (!newTemplate) throw new InternalServerError('Unable to save template.');

    return {
      statusCode: 201,
      message: 'Template created successfully.',
      data: { newTemplate }
    }
  }

  static async getTemplate(id) {
    const template = await Template.getById(id);
    if (!template) throw new NotFoundError('Template not found.');

    return {
      message: 'Fetched template successfully.',
      data: { emailTemplate: template }
    }
  }

  static async updateTemplate(userId, templateId, updateDto) {
    const template = await Template.getById(templateId);
    if (!template) throw new NotFoundError('Template Not Found.');

    function mapDtoToTableFields(dto) {
      const dbFieldNameConvention = {
        textContent: 'text_content',
        htmlContent: 'html_content',
        subjectLine: 'subject_line',
      };

      const data = {}

      for (const [field, value ] of Object.entries(dto) ) {
        if (Object.keys(dbFieldNameConvention).includes(field)) {   
          data[dbFieldNameConvention[field]] = value
        } else  {
          data[field] = value
        }
      }
      return data
    }

    const updateData = mapDtoToTableFields(updateDto);

    let personalizedVariables;
    if (updateDto.textContent) {
      personalizedVariables = getPersonalizedVariables(updateDto.textContent);
    }

    let updatedTemplate = await Template.update({ _id: templateId }, { 
      ...updateData, 
      personalized_variables: personalizedVariables, 
      user: userId 
    });
    if (updatedTemplate.modifiedCount !== 1) throw new InternalServerError('Unable to update template.');
    
    const foundTemplate = await Template.getById(templateId);

    return {
      message: 'Template variables updated successfully.',
      data: { updatedTemplate: foundTemplate }
    }
  }

  static async deleteTemplate(id) {
    const template = await Template.getById(id);
    if (!template) throw new NotFoundError('Template Not Found.');

    const deletedTemplate = await Template.delete(id);
    if (deletedTemplate.deletedCount !== 1) throw new InternalServerError('Unable to delete template.');

    return {
      message: 'Template deleted successfully.',
      data: { deletedTemplateId: id }
    }
  }
}

exports.TemplateService = TemplateService;