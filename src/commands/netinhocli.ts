import { GluegunCommand } from 'gluegun'

const command: GluegunCommand = {
  name: 'netinhocli',
  run: async (toolbox) => {
    const { print, parameters } = toolbox
    // pegar entrada do usuário planilha com as imagens
    const urlPlanilha = parameters.first
    print.info(urlPlanilha)
  },
}

module.exports = command
