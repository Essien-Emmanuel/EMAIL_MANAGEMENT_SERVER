const { MailtrapClient } = require("mailtrap");
const { EmailAdapter } = require("../generic/index");

const Config = require('../../../config');

const { mailTrapEndpoint, mailTrapToken } = Config.mail

class MailTrapAdapter extends EmailAdapter {
	constructor(config) {
		super(config);
		this.client = new MailtrapClient(config);
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

			if (!response.success) return { success: false, email: email.to };
			return { success: true, email: email.to };
		} catch (error) {
			console.log('- Error:: MailTrapError')
		}
	}
}

const APIMailer = new MailTrapAdapter({ endpoint: mailTrapEndpoint, token: mailTrapToken });

module.exports = {
	APIMailer,
	MailTrapAdapter
}
