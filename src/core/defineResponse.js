function defineResponse(data) {
  return {
    status: 'success',
    messaage: data.message,
    statusCode: data.statusCode || 200,
    data: { ...data.data }
  }
}

module.exports = defineResponse;