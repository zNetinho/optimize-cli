import * as path from 'path'
import * as fs from 'fs'
import sharp = require('sharp')
import { checkExistDirectory } from './imageService'

const pathOtimized = path.resolve(__dirname, `../../public/images/otimizadas`)
const folderPath = path.resolve(__dirname, '../../public/images')

/**
 * Otimiza as imagens de um diretório usando o Sharp.
 *
 * @return {Promise<void>} Devolve uma Promise vazia.
 */
async function otimizaImagem(): Promise<void> {
  const diretorio = await fs.promises.readdir(folderPath)
  const pattern = /\.(jpg|jpeg|gif|png|webp|avif|tiff|JPEG|PNG|WebP|AVIF|GIF|SVG|TIFF)$/i
  const files = diretorio.filter((file) => pattern.test(file))

  checkExistDirectory(folderPath)
  checkExistDirectory(pathOtimized)

  if (files.length > 0) {
    await Promise.all(
      files.map(async (file) => {
        try {
          if (
            path.extname(file) === '.jpg' ||
            path.extname(file) === '.JPG' ||
            path.extname(file) === '.jpeg' ||
            path.extname(file) === '.JPEG'
          ) {
            const imageOtimizado = await otimizaImagens(file)
            if (imageOtimizado) {
              await fs.promises.writeFile(
                `${pathOtimized}/${file}`,
                imageOtimizado
              )
            }
          } else if (
            path.extname(file) === '.png' ||
            path.extname(file) === '.PNG'
          ) {
          }

          const sizeArchiveNotOptimized =
            (await fs.promises.stat(`${pathOtimized}/${file}`)).size / 1024
          const sizeArchive =
            (await fs.promises.stat(`${pathOtimized}/${file}`)).size / 1024
          console.log('Resultado:', sizeArchiveNotOptimized)
          console.log(
            `Tamanho do arquivo ${file} otimizado:`,
            sizeArchive.toFixed(2),
            'KB'
          )
        } catch (error) {
          handleSharpError(error, file)
        }
      })
    )
  }
}

async function otimizaImagens(file: string): Promise<any> {
  const extension = path.extname(file)
  const format = getSharpFormat(extension)
  const content = await fs.promises.readFile(`${folderPath}/${file}`)

  if (format === 'jpeg' || format === 'jpg') {
    const compressContent = await sharp(content)
      .toFormat('jpeg', {
        progressive: true,
        quality: 80,
      })
      .toBuffer()
    return compressContent
  } else if (format === 'png') {
    const compressContent = await sharp(content)
      .toFormat('png', {
        progressive: true,
        quality: 80,
        palette: true,
      })
      .toBuffer()
      return compressContent
  } else if (format === 'webp') {
    const compressContent = await sharp(content)
      .toFormat('webp', {
        quality: 80,
      })
      .toBuffer()
    return compressContent
  }
}

function getSharpFormat(extension: string): keyof sharp.FormatEnum | null {
  const formatMap: { [key: string]: keyof sharp.FormatEnum } = {
    '.jpg': 'jpeg',
    '.jpeg': 'jpeg',
    '.png': 'png',
    '.webp': 'webp',
    '.tiff': 'tiff',
    '.gif': 'gif',
    '.avif': 'avif',
  }
  return formatMap[extension.toLowerCase()] || null
}

function handleSharpError(error: Error, file: string): void {
  const errorMessage = error.message.toLowerCase()

  if (errorMessage.includes('libspng read error')) {
    console.error(
      `Erro ao processar a imagem ${file}: Arquivo PNG corrompido ou inválido.`
    )
  } else if (errorMessage.includes('vipsjpeg: premature end of input file')) {
    console.error(
      `Erro ao processar a imagem ${file}: Arquivo JPEG corrompido ou incompleto.`
    )
  } else {
    console.error(
      `Erro inesperado ao processar a imagem ${file}: ${error.message}`
    )
  }
}

export { otimizaImagem }
