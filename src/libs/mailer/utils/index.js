const handlebars = require('handlebars');
const { MailFactory } = require('../index');
const { replacePlaceholders } = require('../../../utils/index');

const generateEmailHTMLPart  = async (templateString, { subject, greeting, message}) => {
  const template = handlebars.compile(templateString);
  const generatedHTMLPart =  template({subject, greeting, message});

  return generatedHTMLPart
}

const sendMultipleEmail = async ({recipients, template, variables, serviceProvider,  containsHtmlPart = true, config}) => {
  let successCount = 0
  const mailedRecipients = []

  for (const recipient of recipients) {
    let htmlPart;
    if (containsHtmlPart){
      htmlPart = await generateEmailHTMLPart(template.htmlPart, variables)
     }
    const text = replacePlaceholders(template.text, variables);
    const subject = template.subject;
  
    const Mail = new MailFactory(config).getSender(serviceProvider.name);
    const mailResponse = await Mail.send({ to: recipient, subject, text, htmlPart});
    console.log('response ', mailResponse)
    
    if (mailResponse.success) {
      ++successCount
      mailedRecipients.push(recipient);
    }
    
  }

  if (successCount < 1 ) return {
    successCount: 0,
    mailedRecipients: [],
    status: 'failed'
  }

  return {
    successCount,
    mailedRecipients,
    status: 'success'
  }
}

module.exports = {
  generateEmailHTMLPart,
  sendMultipleEmail
};