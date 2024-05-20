const { compile } = require('handlebars');

class Service {
  getSender(providerConfigModel, templateId) {
    switch (providerConfigModel.name) {
      case 'Mailjet':
        return 
      default:
        break;
    }
  }
  compileTemplate(templateModel, data) {
    return compile(templateModel.htmlPart, {data})
  }
}