import { FormDefaultCadastroAcervoDTO } from '~/core/dto/form-cadastro-acervo';
import { formatarDuasCasasDecimais } from '~/core/utils/functions';

export const mapearDtoCadastrosAcervo = (dados: FormDefaultCadastroAcervoDTO) => {
  if (dados?.arquivos?.length) {
    dados.arquivos = dados.arquivos.map((item: any) => ({
      xhr: item?.codigo,
      name: item?.nome,
      id: item?.id,
      status: 'done',
    }));
  }

  if (dados?.ano) {
    dados.ano = String(dados.ano);
  }

  if (dados?.altura) {
    dados.altura = formatarDuasCasasDecimais(dados.altura);
  }

  if (dados?.largura) {
    dados.largura = formatarDuasCasasDecimais(dados.largura);
  }

  if (!dados?.creditosAutoresIds?.length) {
    dados.creditosAutoresIds = [];
  }

  if (!dados?.assuntosIds?.length) {
    dados.assuntosIds = [];
  }

  if (!dados?.acessoDocumentosIds?.length) {
    dados.acessoDocumentosIds = [];
  }

  const temCoAutores =
    !!dados?.coAutores?.length &&
    !!dados?.coAutores?.filter((item) => item?.creditoAutorId)?.length;

  if (temCoAutores) {
    dados?.coAutores?.filter((item) => item?.creditoAutorId)?.length;

    const coAutores = [...dados.coAutores];

    dados.coAutores = coAutores.map((item) => ({
      ...item,
      value: item.creditoAutorId,
      label: item.creditoAutorNome,
    }));

    dados.listaTipoAutoria = coAutores.map((item) => ({
      ...item,
      value: item.creditoAutorId,
      label: item.creditoAutorNome,
    }));
  } else {
    dados.coAutores = [];
    dados.listaTipoAutoria = [];
  }

  return dados;
};
