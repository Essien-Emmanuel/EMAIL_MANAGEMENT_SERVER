const MailTrapAdapter = require("./adaptee/mailTrap");

class EmailRepository {
	async send(email) {
		return MailTrapAdapter.send(email);
	}
}

const emailRepo = new EmailRepository();

module.exports = emailRepo;
