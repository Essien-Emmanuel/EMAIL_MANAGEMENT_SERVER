const { MailTrapAdapter } = require("./adaptee/mailTrap");

class MailFactory {
	constructor(config) {
		this.config = config
	}

	static create(slug = 'mail-trap') {
		switch (slug) {
			case 'mail-trap': //remove mailtrap case later and leave as default. it doesn't break anything
				return MailTrapAdapter(this.config)	
			default:
				console.log('Default Mail Service:: Mailtrap ✈');
				return MailTrapAdapter(this.config);
		}
	}
}

exports.MailFactory = MailFactory;
