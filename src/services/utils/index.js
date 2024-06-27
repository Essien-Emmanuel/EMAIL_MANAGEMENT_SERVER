const { APIMailer } = require('../../libs/mailer/adaptee/mailTrap');
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

// OLD CODE

exports.updateRecipientFromFileResponseMsg = (noOfRecipients, existingRecipients, successCount, failedCount, savedRecipientCount, savedRecipients) => {
  const response = {
    responseMsg: null,
    data: {}
  };

  if (successCount === noOfRecipients) {
    response.responseMsg = `Saved all ${noOfRecipients} emails successfully.`;
    response.data.successCount = noOfRecipients;

  } else if (successCount > 0 && successCount < noOfRecipients ) {

    if (existingRecipients.length > 0 && failedCount === 0) {

      response.responseMsg = `Saved ${successCount} emails out of ${noOfRecipients} with ${existingRecipients.length} existing emails`;
      response.data.existingRecipients = existingRecipients;
      response.data.successCount = successCount;
      response.data.savedRecipientCount = savedRecipientCount;
      response.data.savedRecipients = savedRecipients;

    } else if (existingRecipients.length > 0 && failedCount > 0) {

      response.responseMsg =  `Saved ${successCount} emails out of ${noOfRecipients} with ${existingRecipients.length} existing emails and ${failedCount} emails unable to save`;
      response.data.failedCount = failedCount;
      response.data.existingRecipients = existingRecipients;
      response.data.successCount = successCount;
      response.data.savedRecipientCount = savedRecipientCount;
      response.data.savedRecipients = savedRecipients;
    }
  } else if (successCount === 0 && failedCount > 0) {
    response.responseMsg = `Unable to save any of the ${noOfRecipients} emails`;
    response.data.successCount = successCount;
  } else if (successCount === 0 && failedCount === 0) {
    response.responseMsg = `All ${noOfRecipients} emails exists already.`;
    response.data.existingRecipients = existingRecipients;
  }
  return response;
}


exports.sendRecipientWelcomeMail = async (recipients) => {
  const subject = "Welcome to Interactro Service 🥳";
  const body = `We are delighted to inform you that you have been successfully added. `;

  const deliveredEmail = [];
  let emailPromises = [];
  for (const recipient of recipients) {
    const response = APIMailer.send({ to: recipient, subject, text: body});
    
    emailPromises.push(response)
  }
  const responses = await Promise.all(emailPromises);
  if (responses) {
    for (res of responses) {
      if (res) {
        if (res.email) deliveredEmail.push(res.email)
      }
      else continue
    }
  } 
  return deliveredEmail.length < recipients.length ? { success: false, deliveredEmail} : {success: true, deliveredEmail};
}

exports.createUnsentEmailList = (mailResult, savedRecipients) => {
  let unsentRecipients = null; 

  if (mailResult.success === false) {
    if (mailResult.deliveredEmail.length > 0) {
      unsentRecipients = savedRecipients;
      for (const email of mailResult.deliveredEmail ) {
        const index = unsentRecipients.findIndex(email);
        unsentRecipients.splice(index, 1);
      }
    } else unsentRecipients = savedRecipients;
  }
  return unsentRecipients
}