const { parseVariablePaths } = require('../../utils');

exports.getPersonalizedVariables = (textContent) => {
	let variables;
    const tableNameAndField = parseVariablePaths(textContent);
    if (tableNameAndField.length > 0) {
      variables = tableNameAndField.map(variableArr =>  variableArr[1]);
    }
    const personalizedVariables = variables ? variables : [];
	return personalizedVariables
}

exports.checkEmailRecipient = (recipientId, recipients) => {
  let recipientExists = false;
    
  if (recipients.length > 0) {
    for (const recipient of recipients) {
      if (recipient._id.toString() === recipientId) {
        recipientExists = true
        break
       } 
    }
  }else return false

  return recipientExists
}

exports.mapDtoToTableFields = (tableName, dto) => {
  let dbFieldNameConvention;

  if (tableName === 'template') {
    dbFieldNameConvention = {
      textContent: 'text_content',
      htmlContent: 'html_content',
      subjectLine: 'subject_line',
    };
  } else if (tableName === 'providerConfig') {
    dbFieldNameConvention = {
      domainName: 'domain_name',
      domainEmail: 'domain_email',
      emailContainsHtmlPart: 'email_contains_html_part'
    }
  }

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

exports.replaceEmailPlaceholders = (template, data) => {
  return template.replace(/{{\s*subscriber\.(\w+)\s*}}/g, (match, property) => {
    return data[property] || match;
});
}