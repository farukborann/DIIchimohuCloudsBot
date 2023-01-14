const { translate } = require('free-translate')

const TranlateTR2EN = async (data) => {
  if (!data.trim()) return ''
  const translatedText = await translate(data, { from: 'tr', to: 'en' })
  return translatedText
}

module.exports = { TranlateTR2EN }
