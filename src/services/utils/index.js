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

exports.updateRecipientFromFileResponseMsg = (noOfRecipients, existingRecipients, successCount, failedCount) => {
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

    } else if (existingRecipients.length > 0 && failedCount > 0) {

      response.responseMsg =  `Saved ${successCount} emails out of ${noOfRecipients} with ${existingRecipients.length} existing emails and ${failedCount} emails unable to save`;
      response.data.failedCount = failedCount;
      response.data.existingRecipients = existingRecipients;
      response.data.successCount = successCount
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
