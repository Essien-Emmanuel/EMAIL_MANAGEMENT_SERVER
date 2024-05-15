const Mailjet = require("node-mailjet");
const { EmailAdapter } = require('../generic/index');

class MailjetAdapter extends EmailAdapter {
  constructor(config) {
    super(config)
    this.mailjet = new Mailjet({ apiKey: config.apiKey, apiSecret: config.apiSecret });
  }

	async send(email) {
    try {
      const { to: recipient, subject, htmlPart,  text } = email;
      const result = await mailjet.post("send", { version: "v3.1" }).request({
        Messages: [
          {
            From: {
              Email: "essienemma300dev@gmail.com",
              Name: "school volte",
            },
            To: [
              {
                Email: recipient,
              },
            ],
            Subject: subject,
            HTMLPart: htmlPart,
            TextPart: text,
            CustomerID: "AppGettingStartedTest",
          },
        ],
      });

      if (!result.response.status !== 200) return { success: false };

			return { success: true };

    } catch (error) {
      console.log(error)
    }
	}
}

exports.MailjetAdapter = MailjetAdapter;