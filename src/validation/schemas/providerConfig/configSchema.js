exports.getConfigPropSchema = (serviceProviderName) => {
  switch (serviceProviderName) {
    case 'mailjet':
      return {
        apiKey: { type: 'string'},
        apiSecret: { type: 'string'}
      }
    case 'mailtrap':
      return {
        token: { type: 'string' },
        endpoint: { type: 'string' },
      }
    default:
      return;
  }
}