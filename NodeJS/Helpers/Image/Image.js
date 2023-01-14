const axios = require('axios')
const Jimp = require('jimp')

const LoadImage = async (imgUrl) => {
  let image = await Jimp.read(imgUrl)

  if (image.bitmap.width > image.bitmap.height) image.resize(1500, Jimp.AUTO, Jimp.RESIZE_NEAREST_NEIGHBOR)
  else image.resize(Jimp.AUTO, 1500, Jimp.RESIZE_NEAREST_NEIGHBOR)

  image.background(0xffffffff)
  image.contain(1500, 1500)

  let imageBuffer = await image.getBase64Async(Jimp.MIME_JPEG)

  let result = await axios.post(
    'http://akuzunstore.xyz/upload.php',
    JSON.stringify({
      token: '7KhoGUJQQm1sebO9chOfamtWEayMlXdG',
      base64String: imageBuffer.split(',').at(-1)
    })
  )
  let response = await result.data
  console.log('Resim yüklendi => ' + imgUrl)
  return response
}

module.exports = { LoadImage }
