import axios from 'axios'
import { GluegunCommand } from 'gluegun'
import * as XLSX from 'xlsx'

import { otimizaImagem } from '../services/opitimizadorService'
import { downloadImage } from '../services/imageService'

const command: GluegunCommand = {
  name: 'optimize-all',
  alias: ['oa', 'optimize-all'],
  description: 'Optimize all images in a sheets',
  run: async (toolbox) => {
    const { print, parameters } = toolbox
    // pegar entrada do usuário planilha com as imagens
    const urlPlanilha = parameters.first
    // ler os dados da planilha
    try {
      // Baixar o arquivo da URL TODO: substituir para input do arquivo.
      const response = await axios.get(urlPlanilha, {
        responseType: 'arraybuffer',
      })
      const buffer = response.data

      // Salvar localmente se necessário TODO: substituir para input do arquivo.
      // filesystem.write('planilha.xlsx', buffer)

      // Ler os dados da planilha do buffer
      const workbook = XLSX.read(buffer, { type: 'buffer', cellDates: true })
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]

      // Converter para JSON
      const data = XLSX.utils.sheet_to_json(worksheet)
      // valida dados da planilha e pega somente as linhas com texto.
      data.forEach(async (row) => {
        const line = row['A'].split('?')[0]
        if (
          line !== undefined &&
          line !== null &&
          line !== '' &&
          !line.includes('imagem')
        ) {
          await downloadImage(line)
        } else {
          console.log('Linha inválida:', line)
        }
      })

      await otimizaImagem()

      return print.success('Imagens otimizadas com sucesso!')
    } catch (error) {
      print.error('Erro ao baixar ou ler a planilha.')
      print.error(error.message)
    }
  },
}

module.exports = command
