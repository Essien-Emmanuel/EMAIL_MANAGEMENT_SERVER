const { MailTrapAdapter } = require("./adaptee/mailTrap");
const { MailjetAdapter } = require('./adaptee/mailjet');

class MailFactory {
	constructor(config) {
		this.config = config
	}

	getSender(name = 'mailtrap') {
		switch (name) {
			case 'mailtrap': //remove mailtrap case later and leave as default. it doesn't break anything
				return new MailTrapAdapter(this.config)	
			case 'mailjet':
				return new MailjetAdapter(this.config);
			default:
				console.log('Default Mail Service:: Mailtrap ✈');
				return new MailTrapAdapter(this.config);
		}
	}
}

exports.MailFactory = MailFactory;
