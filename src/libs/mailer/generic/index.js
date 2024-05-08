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
  constructor(header = null, subjectLine = null, greeting = null, bodyContent = null, callToAction = null, footer = null, personalizedVariables = null) {
    this.header = header;
    this.subjectLine = subjectLine;
    this.greeting = greeting;
    this.bodyContent = bodyContent,
    this.callToAction = callToAction;
    this.footer = footer;
    this.personalizedVariables = personalizedVariables;
  }
  
}

module.exports = {
  Email,
  EmailAdapter,
  EmailTemplate
}