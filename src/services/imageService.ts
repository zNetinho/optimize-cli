import axios from 'axios'
import * as fs from 'fs'
import * as path from 'path'

const folderPath = path.resolve(__dirname, '../../public/images')
async function downloadImage(url: string): Promise<string | undefined> {
  const fileName = path.basename(url)
  const filePath = path.resolve(folderPath, fileName)

  // Garantindo que o diretório existe
  checkExistDirectory(folderPath)

  // if (fileName.includes('.jpg') || fileName.includes('.JPG')) {
  try {
    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'stream',
      validateStatus: (status) => status === 200 || status === 404,
    })

    if (response.status === 200) {
      const writer = fs.createWriteStream(filePath)
      response.data.pipe(writer)
      if (response.data && response.status === 200) {
        return new Promise((resolve, reject) => {
          writer.on('finish', resolve)
          writer.on('error', reject)
        })
      } else {
        return Promise.resolve(undefined)
      }
    }
  } catch (error) {
    if (error.code === 'ERR_BAD_REQUEST') {
      throw new Error(
        'Houve um erro ao realizar o download da imagem verifique a URL: ' +
          error.message
      )
    } else if (error.code === 'ERR_INVALID_URL') {
      throw new Error(
        'Houve um erro ao realizar o download da imagem verifique a URL: ' +
          error.message
      )
    }
    console.error('Erro ao baixar a imagem:', error)
  }
  // }
  return 'Otimização das imagens do diretório concluída'
}

function checkExistDirectory(path: string): boolean {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true })
  } else {
    return
  }
}

export { checkExistDirectory, downloadImage }
