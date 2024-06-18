// BroadCastSchema.pre('save', function(next) {
//   this.subscriber_length = this.subscribers.length;
//   this.updated_at = Date.now();
//   next();
// });

// BroadCastSchema.pre('findOneAndUpdate', function(next) {
//   if (this._update.subscribers) {
//       this._update.subscriber_length = this._update.subscribers.length;
//   }
//   this._update.updated_at = Date.now();
//   next();
// });
// BroadCastSchema.pre('update', function(next) {
//   if (this._update.subscribers) {
//       this._update.subscriber_length = this._update.subscribers.length;
//   }
//   this._update.updated_at = Date.now();
//   next();
// });

const { APIMailer } = require('./src/libs/mailer/adaptee/mailTrap');
async function sendMail() {
    const res = await APIMailer.send({ to: 'essienemma300dev@gmail.com', subject: 'test', text: 'testing'})
    if (!res.success) console.log(res.message)
    else console.log(res.message)
}
sendMail()