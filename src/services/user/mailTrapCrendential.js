const {MailTrapCredential } = require('../../database/repositories/MailTrapCredential.repo');
const {IMailTrapCredential} = require('../../database/models/MailTrapCredential')
const { cleanData} = require('../../utils/sanitizeData');
const { NotFoundError, ResourceConflictError, InternalServerError } = require('../../libs/exceptions/index');

class MailTrapCredentialService {
  static async createCredential(credentialDto) {
    const { userId, serviceProviderId} = credentialDto;

    const credential = await MailTrapCredential.getbyUserIdAndServiceProvider({userId, serviceProviderId});
    if (credential) throw new ResourceConflictError('Mailtrap Credentials already exist');
    
    const createdCredential = await MailTrapCredential.create({
      ...credentialDto, 
      user: userId, 
      mailServiceProvider: serviceProviderId
    });
    
    if (!createdCredential) throw new InternalServerError('Unable to save Mailtrap Credentials');

    const cleanedCredentialData = cleanData(createdCredential._doc, IMailTrapCredential);
    
    return {
      statusCode: 201,
      message: 'Saved Mailtrap Credentials Successfully!',
      data: cleanedCredentialData
    }
  }

  static async getCredential(_id) {
    const credential = await MailTrapCredential.getById(_id);
    if (!credential) throw new NotFoundError('Mailtrap Credential Not Found!');

    const cleanedCredentialData = cleanData(credential._doc, IMailTrapCredential);

    return {
      message: "Fetched Mailtrap Credentials Successfully!",
      data: cleanedCredentialData
    }
  }  

  static async updateCredential(filter, updateDto) {
    const {_id} = filter;

    const credential = await MailTrapCredential.getById(_id);
    if (!credential) throw new NotFoundError('Mailtrap Credential Not Found!');
    
    const updatedCredential = await MailTrapCredential.update({_id}, updateDto);
    if (updatedCredential.modifiedCount !== 1) throw new InternalServerError('Unable to update Mailtrap credential field');

    const fetchedMailTrapCredential = await MailTrapCredential.getById(_id);
    const cleanedFetchedData = cleanData(fetchedMailTrapCredential._doc, IMailTrapCredential);

    return {
      message: 'Updated Mailtrap Credentials Successfully!',
      data: cleanedFetchedData
    }
  }

  static async deleteCredential(_id) {
    const credential = await MailTrapCredential.getById(_id);
    if (!credential) throw new NotFoundError('Mailtrap credential Not Found!');

    const deletedCredential = await MailTrapCredential.delete(_id);
    if (deletedCredential.deletedCount !== 1) throw new InternalServerError('Unable to delete Mailtrap Credential!');

    return {
      message: 'Mailtrap Credential deleted successfully!',
      data: { deletedCredentialId: _id }
    }
  }
}

exports.MailTrapCredentialService = MailTrapCredentialService;