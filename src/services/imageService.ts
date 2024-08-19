import axios from 'axios'
import * as fs from 'fs'
import * as path from 'path'

const folderPath = path.resolve(__dirname, '../../public/images')
async function downloadImage(url: string): Promise<void> {
  const fileName = path.basename(url)
  const filePath = path.resolve(folderPath, fileName)

  // Garantindo que o diretório existe
  checkExistDirectory(folderPath)

  if (fileName.includes('.jpg') || fileName.includes('.JPG')) {
    try {
      const response = await axios({
        method: 'GET',
        url: url,
        responseType: 'stream',
      })
      const writer = fs.createWriteStream(filePath)
      response.data.pipe(writer)
      return new Promise((resolve, reject) => {
        writer.on('finish', resolve)
        writer.on('error', reject)
      })
    } catch (error) {
      console.error('Erro ao baixar a imagem:', error)
    }
  }
  return
}

function checkExistDirectory(path: string): boolean {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true })
  } else {
    return
  }
}

export { checkExistDirectory, downloadImage }
