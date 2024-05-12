const {MailTrapCredential } = require('../../database/repositories/MailTrapCredential.repo');

class MailTrapCrendentialService {
  static async createCredential(credentialDto) {
    const credential = await MailTrapCredential.getById()
    const createdCredential = await MailTrapCredential.create(credentialDto); 
  }
}