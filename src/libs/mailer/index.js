const MailTrapSender = require("./adaptee/mailTrap");

class EmailRepository {
	async send(email) {
		return MailTrapSender.send(email);
	}
}

const emailRepo = new EmailRepository();

module.exports = emailRepo;
