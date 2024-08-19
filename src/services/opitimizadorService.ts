import * as path from 'path'
import * as fs from 'fs'
import sharp = require('sharp')
import { checkExistDirectory } from './imageService'

const pathOtimized = path.resolve(__dirname, `../../public/images/otimizadas`)
const folderPath = path.resolve(__dirname, '../../public/images')

async function otimizaImagem(): Promise<void> {
  const diretorio = fs.readdirSync(folderPath)
  const pattern = new RegExp('^.*.(jpg|JPG|gif|GIF|png|PNG)$')
  const files = diretorio.filter((file) => pattern.test(file))

  checkExistDirectory(folderPath)
  checkExistDirectory(pathOtimized)

  if (files.length > 0) {
    // O `async`/ `await` não funciona nas funções do Array,
    // então é necessário utilizar `await Promise.all`,
    // porque a função da lib `sharp` que será utilizada retorna uma promise.
    const result = await Promise.all(
      files.map(async (file) => {
        const content = await fs.readFileSync(`${folderPath}/${file}`)
        const compressContent = await sharp(content)
          .toFormat('jpeg', {
            progressive: true,
            quality: 85,
          })
          .toBuffer()
        console.log(result)

        await fs.writeFileSync(`${pathOtimized}/${file}`, compressContent)
        const sizeArchive = fs.statSync(`${pathOtimized}/${file}`).size / 1024
        console.log(
          'Tamanho do arquivo otimizado: ',
          sizeArchive.toFixed(2),
          'KB'
        )
        return file
      })
    )
  }

  return
}

export { otimizaImagem }
