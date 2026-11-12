import { render, screen } from '@testing-library/react';
import { Form } from 'antd';
import React from 'react';
import { AcervoLinhaRetornoDTO } from '~/core/dto/acervo-linha-retorno-dto';
import { FormPageConfigCadastroAcervoProps } from '~/core/dto/form-cadastro-acervo';
import { FieldAcervoEnum, PropsByFieldAcervoEnum } from '~/core/enum/field-acervo-enum';
import { TipoAcervo } from '~/core/enum/tipo-acervo';
import { PermissaoContext } from '~/routes/config/guard/permissao/provider';
import FormContentCadastroAcervo from './form-content-cadastro-acervo';

jest.mock('./form-fields', () => {
  const makeField = (name: string) => {
    const MockField = (props: {
      extra?: React.ReactNode;
      formItemProps?: { extra?: React.ReactNode };
      disabled?: boolean;
    }) => (
      <div data-testid={`field-${name}`} data-disabled={String(!!props.disabled)}>
        {props.extra}
        {props.formItemProps?.extra}
      </div>
    );
    MockField.displayName = name;
    return MockField;
  };

  const names = [
    'EditorDescricao',
    'InputAcessibilidade',
    'InputAno',
    'InputCodigoAntigo',
    'InputCodigoNovo',
    'InputCopia',
    'InputDataAcervo',
    'InputDimensaoAltura',
    'InputDimensaoDiametro',
    'InputDimensaoLargura',
    'InputDimensaoProfundidade',
    'InputDisponibilizacao',
    'InputDuracao',
    'InputEdicao',
    'InputISBN',
    'InputLocalizacao',
    'InputLocalizacaoCDD',
    'InputLocalizacaoPHA',
    'InputNotasGerais',
    'InputNumeroDePaginas',
    'InputProcedencia',
    'InputQuantidade',
    'InputResolucao',
    'InputSubtitulo',
    'InputTamanhoArquivo',
    'InputTecnica',
    'InputTipoAnexo',
    'InputTipoAutoria',
    'InputTitulo',
    'InputTombo',
    'InputVolume',
    'RadioAutorizacaoUsoImagem',
    'RadioCopiaDigital',
    'SelectAcessoDocumento',
    'SelectAssunto',
    'SelectAutor',
    'SelectCoautor',
    'SelectConservacao',
    'SelectCredito',
    'SelectCromia',
    'SelectEditora',
    'SelectFormatoImagem',
    'SelectIdioma',
    'SelectMaterial',
    'SelectSerieColecao',
    'SelectSuporte',
    'SelectSituacaoAcervo',
  ];

  return Object.fromEntries(names.map((n) => [n, makeField(n)]));
});

jest.mock('./form-fields/radio-acervo-disponivel', () => ({
  RadioAcervoDisponivel: ({ extra }: { extra?: React.ReactNode }) => (
    <div data-testid='field-RadioAcervoDisponivel'>{extra}</div>
  ),
}));

jest.mock('./form-fields/upload-imagem-capa', () => {
  const MockUploadCapa = () => <div data-testid='field-UploadImagemCapa' />;
  return MockUploadCapa;
});

jest.mock('~/components/cdep/upload', () => {
  const MockUpload = ({ formItemProps }: { formItemProps?: { extra?: React.ReactNode } }) => (
    <div data-testid='field-UploadArquivosCDEP'>{formItemProps?.extra}</div>
  );
  return MockUpload;
});

type PermissaoValue = React.ComponentProps<typeof PermissaoContext.Provider>['value'];

const ALL_FORM_FIELDS = Object.values(FieldAcervoEnum)
  .filter((v): v is FieldAcervoEnum => typeof v === 'number')
  .map((fieldAcervo) => ({ fieldAcervo, sm: 12 }));

const renderContent = (options?: {
  fieldsConfig?: FormPageConfigCadastroAcervoProps;
  desabilitarCampos?: boolean;
  errosAcervoLinhaRetorno?: AcervoLinhaRetornoDTO;
}) => {
  const Wrapper: React.FC = () => {
    const [form] = Form.useForm();
    return (
      <PermissaoContext.Provider
        value={
          { desabilitarCampos: options?.desabilitarCampos ?? false } as unknown as PermissaoValue
        }
      >
        <Form form={form}>
          <FormContentCadastroAcervo
            form={form}
            fieldsConfig={options?.fieldsConfig}
            errosAcervoLinhaRetorno={options?.errosAcervoLinhaRetorno}
          />
        </Form>
      </PermissaoContext.Provider>
    );
  };

  return render(<Wrapper />);
};

describe('FormContentCadastroAcervo', () => {
  it('C13: retorna vazio quando fieldsConfig está ausente ou sem fields', () => {
    const { container, rerender } = render(
      <PermissaoContext.Provider value={{ desabilitarCampos: false } as unknown as PermissaoValue}>
        <FormContentCadastroAcervo form={{} as never} fieldsConfig={undefined} />
      </PermissaoContext.Provider>,
    );
    expect(container.firstChild).toBeNull();

    rerender(
      <PermissaoContext.Provider value={{ desabilitarCampos: false } as unknown as PermissaoValue}>
        <FormContentCadastroAcervo
          form={{} as never}
          fieldsConfig={{ tipo: TipoAcervo.Bibliografico, urlBase: '/api', fields: [] }}
        />
      </PermissaoContext.Provider>,
    );
    expect(container.firstChild).toBeNull();
  });

  it('C14: renderiza todos os campos mapeados de FieldAcervoEnum e ignora caso default', () => {
    renderContent({
      desabilitarCampos: true,
      fieldsConfig: {
        tipo: TipoAcervo.Bibliografico,
        urlBase: '/api/acervo',
        fields: [...ALL_FORM_FIELDS, { fieldAcervo: 9999 as FieldAcervoEnum, sm: 12 }],
      },
    });

    expect(screen.getByTestId('field-InputTitulo')).toBeInTheDocument();
    expect(screen.getByTestId('field-UploadImagemCapa')).toBeInTheDocument();
    expect(screen.getByTestId('field-UploadArquivosCDEP')).toBeInTheDocument();
    expect(screen.getByTestId('field-RadioAcervoDisponivel')).toBeInTheDocument();
    expect(screen.getByTestId('field-EditorDescricao')).toHaveAttribute('data-disabled', 'true');
  });

  it('C15: exibe Alert de erro de planilha quando errosAcervoLinhaRetorno possuiErro=true', () => {
    const tituloKey = PropsByFieldAcervoEnum[FieldAcervoEnum.Titulo].name;
    const anoKey = PropsByFieldAcervoEnum[FieldAcervoEnum.Ano].name;

    renderContent({
      fieldsConfig: {
        tipo: TipoAcervo.Bibliografico,
        urlBase: '/api/acervo',
        fields: [
          { fieldAcervo: FieldAcervoEnum.Titulo, sm: 12 },
          { fieldAcervo: FieldAcervoEnum.Ano, sm: 12 },
        ],
      },
      errosAcervoLinhaRetorno: {
        [tituloKey]: {
          possuiErro: true,
          conteudo: 'Valor inválido',
          mensagem: 'Título obrigatório na planilha',
        },
        [anoKey]: {
          possuiErro: false,
          conteudo: '2020',
          mensagem: '',
        },
      } as unknown as AcervoLinhaRetornoDTO,
    });

    expect(screen.getByText('Título obrigatório na planilha')).toBeInTheDocument();
    expect(screen.getByText('Planilha: Valor inválido')).toBeInTheDocument();
  });
});
