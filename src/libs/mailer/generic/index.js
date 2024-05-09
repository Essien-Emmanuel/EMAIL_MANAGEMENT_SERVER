class Target {
  send(){}
}

class EmailAdapter extends Target {
  constructor(EmailServiceAdaptee) {
    super()
    this.adaptee = EmailServiceAdaptee;
  }

  send() {
    return this.adaptee.send()
  }
}


class Email {
  constructor(to, template) {
    this.to = to;
    this.template = template;
  }
  createTemplate() {
    return this.template
  }
}

class EmailTemplate {
  constructor(subject = null, greeting = null, message = null) {
    this.subject = subject;
    this.greeting = greeting;
    this.message = message;
  }
  
}

module.exports = {
  Email,
  EmailAdapter,
  EmailTemplate
}