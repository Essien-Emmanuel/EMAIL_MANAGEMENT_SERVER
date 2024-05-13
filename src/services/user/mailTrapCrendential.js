const {MailTrapCredential } = require('../../database/repositories/MailTrapCredential.repo');
const { cleanData} = require('../../utils/sanitizeData');
const { NotFoundError, ResourceConflictError, InternalServerError } = require('../../libs/exceptions/index');

class MailTrapCrendentialService {
  static async createCredential(credentialDto) {
    const { userId, serviceProviderId} = credentialDto;
    const credential = await MailTrapCredential.getbyUserIdAndServiceProvider({userId, serviceProviderId});
    if (credential) throw new ResourceConflictError('Mail Trap Credentials already exist');

    const createdCredential = await MailTrapCredential.create(credentialDto);
    if (!createdCredential) throw new InternalServerError('Unable to save Mail Trap Credentials');

    const cleanedCredentialData = cleanData(createdCredential);
    
    return {
      statusCode: 201,
      message: 'Saved Mail Trap Credentials Successfully!',
      data: cleanedCredentialData
    }
  }
}