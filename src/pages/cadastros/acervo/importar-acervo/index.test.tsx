import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import {
  CDEP_BUTTON_AATUALIZAR_DADOS,
  CDEP_BUTTON_BAIXAR_MODELO,
  CDEP_BUTTON_IMPORTAR_ARQUIVO,
  CDEP_BUTTON_VOLTAR,
} from '~/core/constants/ids/button/intex';
import {
  ACERVO_EXCLUIR_LINHA,
  DESEJA_DESCARTAR_DADOS_PLANILHA_ATUAL_E_CARREGAR_SELECIONADA,
} from '~/core/constants/mensagens';
import { ImportacaoStatusEnum } from '~/core/enum/importacao-status-enum';
import { ROUTES } from '~/core/enum/routes';
import { TipoAcervo, TipoAcervoDisplay, TipoAcervoPlanilhaModelo } from '~/core/enum/tipo-acervo';
import acervoArteGraficaImportacaoService from '~/core/services/acervo-arte-grafica-importacao-service';
import acervoAudiovisualImportacaoService from '~/core/services/acervo-audiovisual-importacao-service';
import acervoBibliograficoImportacaoService from '~/core/services/acervo-bibliografico-importacao-service';
import acervoDocumentalImportacaoService from '~/core/services/acervo-documental-importacao-service';
import acervoFotograficoImportacaoService from '~/core/services/acervo-fotografico-importacao-service';
import acervoTridimensionalImportacaoService from '~/core/services/acervo-tridimensional-importacao-service';
import { confirmacao } from '~/core/services/alerta-service';
import armazenamentoService from '~/core/services/armazenamento-service';
import { downloadBlob } from '~/core/utils/functions';
import ImportarAcervo from './index';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('~/core/services/alerta-service', () => ({
  confirmacao: jest.fn(),
}));

jest.mock('~/core/services/armazenamento-service', () => ({
  __esModule: true,
  default: {
    downloadPorTipoAcervo: jest.fn(),
  },
}));

jest.mock('~/core/utils/functions', () => ({
  downloadBlob: jest.fn(),
}));

const makeServiceMock = () => ({
  __esModule: true,
  default: {
    obterImportacaoPendente: jest.fn(),
    atualizarLinhaParaSucesso: jest.fn(),
    removerLinhaDoArquivo: jest.fn(),
    importarArquivo: jest.fn(),
  },
});

jest.mock('~/core/services/acervo-bibliografico-importacao-service', () => makeServiceMock());
jest.mock('~/core/services/acervo-documental-importacao-service', () => makeServiceMock());
jest.mock('~/core/services/acervo-arte-grafica-importacao-service', () => makeServiceMock());
jest.mock('~/core/services/acervo-audiovisual-importacao-service', () => makeServiceMock());
jest.mock('~/core/services/acervo-fotografico-importacao-service', () => makeServiceMock());
jest.mock('~/core/services/acervo-tridimensional-importacao-service', () => makeServiceMock());

jest.mock('~/components/cdep/input/tipo-acervo', () => {
  const { Form } = jest.requireActual('antd');
  const MockSelectTipoAcervo = () => {
    const form = Form.useFormInstance();
    return (
      <Form.Item name='tipoAcervo'>
        <input
          aria-label='tipo-acervo'
          onChange={(e) =>
            form.setFieldValue('tipoAcervo', e.target.value ? Number(e.target.value) : undefined)
          }
        />
      </Form.Item>
    );
  };
  return MockSelectTipoAcervo;
});

jest.mock('./table-importacao', () => {
  const MockTableImportacao = ({ dataSource }: { dataSource: Array<{ nome: string }> }) => (
    <div data-testid='table-importacao'>{dataSource[0]?.nome}</div>
  );
  return MockTableImportacao;
});

jest.mock('./table-importacao-erro', () => {
  const MockTableErro = ({
    atualizarLinhaParaSucesso,
    removerLinhaDoArquivo,
  }: {
    atualizarLinhaParaSucesso: (n: number) => void;
    removerLinhaDoArquivo: (n: number) => void;
  }) => (
    <div data-testid='table-importacao-erro'>
      <button type='button' onClick={() => atualizarLinhaParaSucesso(7)}>
        AtualizarLinha7
      </button>
      <button type='button' onClick={() => removerLinhaDoArquivo(8)}>
        RemoverLinha8
      </button>
    </div>
  );
  return MockTableErro;
});

jest.mock('./table-importacao-sucesso', () => {
  const MockTableSucesso = () => <div data-testid='table-importacao-sucesso' />;
  return MockTableSucesso;
});

jest.setTimeout(15000);

describe('ImportarAcervo', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('C09: renderiza estado inicial com botões desabilitados e navega em Voltar', () => {
    render(<ImportarAcervo />);

    expect(screen.getByText('Importar Acervo')).toBeInTheDocument();
    expect(document.getElementById(CDEP_BUTTON_BAIXAR_MODELO)).toBeDisabled();
    expect(document.getElementById(CDEP_BUTTON_IMPORTAR_ARQUIVO)).toBeDisabled();
    expect(document.getElementById(CDEP_BUTTON_AATUALIZAR_DADOS)).toBeDisabled();

    fireEvent.click(document.getElementById(CDEP_BUTTON_VOLTAR) as HTMLElement);
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.ACERVO);
  });

  it.each([
    [TipoAcervo.Bibliografico, acervoBibliograficoImportacaoService],
    [TipoAcervo.DocumentacaoTextual, acervoDocumentalImportacaoService],
    [TipoAcervo.ArtesGraficas, acervoArteGraficaImportacaoService],
    [TipoAcervo.Audiovisual, acervoAudiovisualImportacaoService],
    [TipoAcervo.Fotografico, acervoFotograficoImportacaoService],
    [TipoAcervo.Tridimensional, acervoTridimensionalImportacaoService],
  ])(
    'C10: seleciona TipoAcervo=%s, consulta serviço correto e exibe Empty sem pendência',
    async (tipo, service) => {
      (service.obterImportacaoPendente as jest.Mock).mockResolvedValue({
        sucesso: false,
      });

      render(<ImportarAcervo />);

      fireEvent.change(screen.getByLabelText('tipo-acervo'), { target: { value: String(tipo) } });

      await waitFor(() => {
        expect(service.obterImportacaoPendente).toHaveBeenCalledTimes(1);
      });

      expect(
        screen.getByText(`Sem importação pendente para o acervo ${TipoAcervoDisplay[tipo]}`),
      ).toBeInTheDocument();
    },
  );

  it('C11/C12/C13/C16/C17: exibe tabelas com status!=1, baixa modelo, atualiza, corrige e remove linha', async () => {
    (acervoBibliograficoImportacaoService.obterImportacaoPendente as jest.Mock).mockResolvedValue({
      sucesso: true,
      dados: {
        id: 55,
        nome: 'bib.xlsx',
        dataImportacao: '2026-11-10T10:00:00',
        status: ImportacaoStatusEnum.Erros,
      },
    });
    (armazenamentoService.downloadPorTipoAcervo as jest.Mock).mockResolvedValue({
      sucesso: true,
      dados: new Blob(['xlsx']),
    });
    (acervoBibliograficoImportacaoService.atualizarLinhaParaSucesso as jest.Mock).mockResolvedValue(
      {
        sucesso: true,
      },
    );
    (acervoBibliograficoImportacaoService.removerLinhaDoArquivo as jest.Mock).mockResolvedValue({
      sucesso: true,
    });
    (confirmacao as jest.Mock).mockImplementation(({ onOk }) => onOk());

    render(<ImportarAcervo />);

    fireEvent.change(screen.getByLabelText('tipo-acervo'), {
      target: { value: String(TipoAcervo.Bibliografico) },
    });

    expect(await screen.findByTestId('table-importacao')).toHaveTextContent('bib.xlsx');
    expect(screen.getByTestId('table-importacao-erro')).toBeInTheDocument();

    fireEvent.click(document.getElementById(CDEP_BUTTON_BAIXAR_MODELO) as HTMLElement);
    await waitFor(() => {
      expect(armazenamentoService.downloadPorTipoAcervo).toHaveBeenCalledWith(
        TipoAcervo.Bibliografico,
      );
    });
    expect(downloadBlob).toHaveBeenCalledWith(
      expect.any(Blob),
      TipoAcervoPlanilhaModelo[TipoAcervo.Bibliografico],
    );

    fireEvent.click(document.getElementById(CDEP_BUTTON_AATUALIZAR_DADOS) as HTMLElement);
    await waitFor(() => {
      expect(acervoBibliograficoImportacaoService.obterImportacaoPendente).toHaveBeenCalledTimes(2);
    });

    fireEvent.click(screen.getByRole('button', { name: 'AtualizarLinha7' }));
    await waitFor(() => {
      expect(acervoBibliograficoImportacaoService.atualizarLinhaParaSucesso).toHaveBeenCalledWith(
        55,
        7,
      );
    });

    fireEvent.click(screen.getByRole('button', { name: 'RemoverLinha8' }));
    expect(confirmacao).toHaveBeenCalledWith(
      expect.objectContaining({ content: ACERVO_EXCLUIR_LINHA }),
    );
    await waitFor(() => {
      expect(acervoBibliograficoImportacaoService.removerLinhaDoArquivo).toHaveBeenCalledWith(
        55,
        8,
      );
    });
  });

  it('C11b/C14/C15: exibe aviso quando status===1 e executa upload com e sem confirmação de descarte', async () => {
    (acervoBibliograficoImportacaoService.obterImportacaoPendente as jest.Mock).mockResolvedValue({
      sucesso: true,
      dados: {
        id: 66,
        nome: 'processando.xlsx',
        dataImportacao: '2026-11-10T10:00:00',
        status: 1,
      },
    });
    (acervoBibliograficoImportacaoService.importarArquivo as jest.Mock)
      .mockResolvedValueOnce({
        sucesso: true,
        dados: {
          id: 67,
          nome: 'novo.xlsx',
          dataImportacao: '2026-11-10T11:00:00',
          status: ImportacaoStatusEnum.Sucesso,
        },
      })
      .mockResolvedValueOnce({ sucesso: false });

    const { container } = render(<ImportarAcervo />);

    fireEvent.change(screen.getByLabelText('tipo-acervo'), {
      target: { value: String(TipoAcervo.Bibliografico) },
    });

    expect(
      await screen.findByText(/Aguarde enquanto processamos seu arquivo/i),
    ).toBeInTheDocument();

    const makeFile = (name: string) =>
      new File(['dados'], name, {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

    // Status 1 != Sucesso: usuário cancela confirmação
    (confirmacao as jest.Mock).mockImplementationOnce(({ onCancel }) => onCancel());
    fireEvent.change(container.querySelector('input[type="file"]') as HTMLInputElement, {
      target: { files: [makeFile('cancelado.xlsx')] },
    });

    await waitFor(() => {
      expect(confirmacao).toHaveBeenCalledWith(
        expect.objectContaining({
          content: DESEJA_DESCARTAR_DADOS_PLANILHA_ATUAL_E_CARREGAR_SELECIONADA,
        }),
      );
    });
    expect(acervoBibliograficoImportacaoService.importarArquivo).not.toHaveBeenCalled();

    // Usuário confirma descarte -> importa e atualiza para Sucesso
    (confirmacao as jest.Mock).mockImplementationOnce(({ onOk }) => onOk());
    fireEvent.change(container.querySelector('input[type="file"]') as HTMLInputElement, {
      target: { files: [makeFile('novo.xlsx')] },
    });

    await waitFor(() => {
      expect(acervoBibliograficoImportacaoService.importarArquivo).toHaveBeenCalledTimes(1);
    });
    expect(await screen.findByTestId('table-importacao')).toHaveTextContent('novo.xlsx');

    // Novo upload com status Sucesso -> não pede confirmação, e sucesso=false limpa dados
    fireEvent.change(container.querySelector('input[type="file"]') as HTMLInputElement, {
      target: { files: [makeFile('falha.xlsx')] },
    });
    await waitFor(() => {
      expect(acervoBibliograficoImportacaoService.importarArquivo).toHaveBeenCalledTimes(2);
    });
    await waitFor(() => {
      expect(screen.queryByTestId('table-importacao')).not.toBeInTheDocument();
    });
  });
});
