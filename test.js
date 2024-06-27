function replacePlaceholders(template, data) {
    return template.replace(/{{\s*subscriber\.(\w+)\s*}}/g, (match, property) => {
        return data[property] || match;
    });
}
// Example usage
const template = 'Hello {{ subscriber.first_name    }}, welcome to our email services {{subscriber.email}}';

const subscriber = {
    first_name: "John",
    email: 'john@gmail.com'
};

const personalizedEmail = replacePlaceholders(template, subscriber);
console.log(personalizedEmail);