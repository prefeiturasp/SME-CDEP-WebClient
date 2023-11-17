import { URL_API_ACERVO_ARTE_GRAFICA_IMPORTACAO_PLANILHA } from '../constants/urls-api';
import { ImportacaoArquivoRetornoDTO } from '../dto/importacao-arquivo-retorno-dto';
import { alterarRegistroParcial, inserirRegistro, obterRegistro } from './api';

const importarArquivo = (file: File) => {
  const fmData = new FormData();
  const config = {
    headers: { 'content-type': 'multipart/form-data' },
  };
  fmData.append('file', file);

  return inserirRegistro<ImportacaoArquivoRetornoDTO>(
    URL_API_ACERVO_ARTE_GRAFICA_IMPORTACAO_PLANILHA,
    fmData,
    config,
  );
};

const obterImportacaoPendente = () =>
  obterRegistro<ImportacaoArquivoRetornoDTO>(URL_API_ACERVO_ARTE_GRAFICA_IMPORTACAO_PLANILHA);

const removerLinhaDoArquivo = (id: number, numeroLinha: number) =>
  alterarRegistroParcial(`${URL_API_ACERVO_ARTE_GRAFICA_IMPORTACAO_PLANILHA}/${id}`, {
    numeroLinha,
  });

const atualizarLinhaParaSucesso = (id: number, numeroLinha: number) =>
  alterarRegistroParcial(
    `${URL_API_ACERVO_ARTE_GRAFICA_IMPORTACAO_PLANILHA}/atualizar-linha/${id}/sucesso`,
    { numeroLinha },
  );

export default {
  importarArquivo,
  removerLinhaDoArquivo,
  obterImportacaoPendente,
  atualizarLinhaParaSucesso,
};
