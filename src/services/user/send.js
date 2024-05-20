module.exports = async function() {
  const providerConfig = await ProviderConfig.findOne({name: sender_provider_name});
  if (!providerConfig) throw new Error('not found');
  
  const provider = await service.getSender(providerConfig)

  const template = await Template.findById(templateId);
  const message = await service.compileTemplate(template, data);

  await provider.send(sender, receiver, message);

  return {
    status: 'ok'
  }
}