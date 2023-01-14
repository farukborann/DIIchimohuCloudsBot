const Mongoose = require('mongoose') // Terminal logging

module.exports.Main = async () => {
  try {
    Mongoose.set('strictQuery', true)
    await Mongoose.connect('mongodb://127.0.0.1:27017/di_ichimohu')
    console.log('Database Connection Successful.')
  } catch (ex) {
    console.log('Database Connection Failed !!!')
  }
}
