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