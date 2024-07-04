const Mailjet = require("node-mailjet");
const { EmailAdapter } = require("../generic/index");

class MailjetAdapter extends EmailAdapter {
  constructor(config) {
    super(config);
    this.mailjet = new Mailjet({
      apiKey: config.apiKey,
      apiSecret: config.apiSecret,
    });
  }

  async send(email) {
    try {
      const { to: recipient, subject, htmlPart, text } = email;
      const result = await this.mailjet
        .post("send", { version: "v3.1" })
        .request({
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
              TrackOpens: "enabled",
              TrackClicks: "enabled",
              CustomerID: "AppGettingStartedTest",
            },
          ],
        });
      if (result.response.status !== 200) return { success: false };

      return { success: true };
    } catch (error) {
      console.error(error.statusCode);
    }
  }
}

exports.MailjetAdapter = MailjetAdapter;
