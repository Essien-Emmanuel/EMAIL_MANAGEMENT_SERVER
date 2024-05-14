const handlebars = require('handlebars');
const { MailFactory } = require('../index');

exports.generateEmailHTMLPart  = async (templateString, { subject, greeting, message}) => {
  const template = handlebars.compile(templateString);
  const generatedHTMLPart =  template({subject, greeting, message});

  return generatedHTMLPart
}

exports.sendMultipleEmail = (recipients, template, { containsHtmlPart = true}) => {
  let successCount = 0
  const mailedRecipients = []

  recipients.map(async recipient => {
    let htmlPart;
    if (containsHtmlPart) htmlPart = await generateEmailHTMLPart(template.template, variables)
    const text = template.text;
    const subject = template.subject;

    const Mail = MailFactory(config).create(MSProvider.slug);
    const mailResponse = Mail.send({ to: recipient, subject, text, htmlPart});

    if (mailResponse.success) {
      successCount++
      mailedRecipients.push(recipient);
    }
  });
  
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
