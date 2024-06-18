const { MailtrapClient } = require("mailtrap");
const { EmailAdapter } = require("../generic/index");

const Config = require('../../../config');

const { mailTrapEndpoint, mailTrapToken } = Config.mail

class MailTrapAdapter extends EmailAdapter {
	constructor(config) {
		super(config);
		this.client = new MailtrapClient(config);
		this.emailResponse = {}
	}
	async send(email) {
		const { to, subject, text} = email;
		const $email = email//this.convertEmail(email);
		try {
			const client = this.client

			const sender = {
				email: "mailtrap@demomailtrap.com",
				name: "Mailtrap Test",
			};
			const recipients = [
				{
					email: $email.to,
				},
			];

			const response = await client.send({
				from: sender,
				to: recipients,
				subject: $email.subject ?? "Interactro Message",
				text: $email.text,
				category: "Integration Test",
			});
			if (response.success){ 
				this.emailResponse.success = true;
				this.emailResponse.email = email.to;
				this.emailResponse.message = 'successfully sent email';
			} else {
				this.emailResponse.success = false;
				this.emailResponse.email = email.to;
				this.emailResponse.message = 'failed to send email';
			}
		} catch (error) {
			console.log('- Error:: MailTrapError');
			const errorMsg = error.message
			this.emailResponse.success = false;
			this.emailResponse.email = email.to;
			this.emailResponse.message = errorMsg;
		}

		return this.emailResponse;
	}
}

const APIMailer = new MailTrapAdapter({ endpoint: mailTrapEndpoint, token: mailTrapToken });

module.exports = {
	APIMailer,
	MailTrapAdapter
}
