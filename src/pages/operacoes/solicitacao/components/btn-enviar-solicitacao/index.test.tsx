import { fireEvent, screen, waitFor } from '@testing-library/react';
import { notification } from '~/components/lib/notification';
import { AcervoSolicitacaoItemRetornoCadastroDTO } from '~/core/dto/acervo-solicitacao-item-retorno-cadastro-dto';
import {
  AcervoDisponibilidadeEnumDisplay,
  AcervoDisponibilidadeSituacaoEnum,
} from '~/core/enum/acervo-disponibilidade-enum';
import { ROUTES } from '~/core/enum/routes';
import { TipoAcervo } from '~/core/enum/tipo-acervo';
import { setAcervosSelecionados } from '~/core/redux/modules/solicitacao/actions';
import { obterTermoDeCompromisso } from '~/core/services/acervo-service';
import acervoSolicitacaoService from '~/core/services/acervo-solicitacao-service';
import { PermissaoContext } from '~/routes/config/guard/permissao/provider';
import { render } from '~/tests/test-utils';
import { AcervoSolicitacaoContext } from '../../provider';
import BtnEnviarSolicitacoes from './index';

const mockNavigate = jest.fn();
const mockDispatch = jest.fn();
const mockUseParams = jest.fn(() => ({} as { id?: string }));

jest.mock('antd/es/checkbox/Checkbox', () => jest.requireActual('antd/lib/checkbox/Checkbox'));

jest.mock('~/components/lib/button/secundary', () => {
  const ActualButtonSecundary = jest.requireActual('~/components/lib/button/secundary').default;
  return {
    __esModule: true,
    default: (props: Record<string, unknown>) => (
      <>
        <ActualButtonSecundary {...props} />
        <button
          type='button'
          data-testid='force-click-enviar'
          style={{ display: 'none' }}
          onClick={props.onClick as () => void}
        />
      </>
    ),
  };
});

jest.mock('~/components/lib/modal', () => {
  const ActualModal = jest.requireActual('~/components/lib/modal').default;
  return {
    __esModule: true,
    default: (props: Record<string, unknown>) => (
      <>
        <ActualModal {...props} />
        {props.open ? (
          <button
            type='button'
            data-testid='force-modal-ok'
            style={{ display: 'none' }}
            onClick={props.onOk as () => void}
          />
        ) : null}
      </>
    ),
  };
});

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => mockUseParams(),
}));

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

jest.mock('~/core/services/acervo-service', () => ({
  __esModule: true,
  obterTermoDeCompromisso: jest.fn(),
}));

jest.mock('~/core/services/acervo-solicitacao-service', () => ({
  __esModule: true,
  default: {
    inserir: jest.fn(),
  },
}));

jest.mock('~/components/lib/notification', () => ({
  notification: {
    success: jest.fn(),
  },
}));

const mockedObterTermo = obterTermoDeCompromisso as jest.MockedFunction<
  typeof obterTermoDeCompromisso
>;
const mockedInserir = acervoSolicitacaoService.inserir as jest.MockedFunction<
  typeof acervoSolicitacaoService.inserir
>;

const itemBibliograficoDisponivel: AcervoSolicitacaoItemRetornoCadastroDTO = {
  id: 1,
  acervoId: 101,
  tipoAcervoId: TipoAcervo.Bibliografico,
  tipoAcervo: 'Bibliográfico',
  titulo: 'Livro Disponível',
  autoresCreditos: ['Autor 1'],
  situacaoId: 1,
  situacao: 'Aguardando atendimento',
  estaDisponivel: true,
  temControleDisponibilidade: true,
  situacaoDisponibilidade:
    AcervoDisponibilidadeEnumDisplay[AcervoDisponibilidadeSituacaoEnum.DISPONIVEL],
  arquivos: [],
  alteraDataVisita: false,
};

const itemBibliograficoIndisponivel: AcervoSolicitacaoItemRetornoCadastroDTO = {
  ...itemBibliograficoDisponivel,
  acervoId: 102,
  titulo: 'Livro Emprestado',
  estaDisponivel: false,
  situacaoDisponibilidade: 'Emprestado',
};

const itemFotografico: AcervoSolicitacaoItemRetornoCadastroDTO = {
  ...itemBibliograficoDisponivel,
  acervoId: 103,
  tipoAcervoId: TipoAcervo.Fotografico,
  tipoAcervo: 'Fotográfico',
  titulo: 'Foto Histórica',
};

const renderBtnEnviar = (
  dataSource: AcervoSolicitacaoItemRetornoCadastroDTO[] = [itemBibliograficoDisponivel],
  podeIncluir = true,
) =>
  render(
    <AcervoSolicitacaoContext.Provider
      value={{
        dataSource,
        setDataSource: jest.fn(),
        podeCancelarSolicitacao: false,
        setPodeCancelarSolicitacao: jest.fn(),
      }}
    >
      <PermissaoContext.Provider
        value={{
          desabilitarCampos: false,
          setDesabilitarCampos: jest.fn(),
          permissao: {
            customRoles: [],
            podeAlterar: true,
            podeConsultar: true,
            podeExcluir: true,
            podeIncluir,
            somenteConsulta: false,
          },
        }}
      >
        <BtnEnviarSolicitacoes />
      </PermissaoContext.Provider>
    </AcervoSolicitacaoContext.Provider>,
  );

describe('BtnEnviarSolicitacoes', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    mockDispatch.mockReset();
    mockUseParams.mockReturnValue({});
    mockedObterTermo.mockReset();
    mockedInserir.mockReset();
    (notification.success as jest.Mock).mockReset();
  });

  it('C11: deve desabilitar o botão "Enviar solicitação" quando sem permissão podeIncluir, com solicitacaoId na rota, com dataSource vazio ou com acervo bibliográfico indisponível', () => {
    const { unmount: unmountSemPermissao } = renderBtnEnviar([itemBibliograficoDisponivel], false);
    const btnSemPermissao = screen.getByRole('button', { name: /enviar solicitação/i });
    expect(btnSemPermissao).toBeDisabled();

    // Testa guarda defensiva if (permissao?.podeIncluir) em onClickEnviar
    fireEvent.click(screen.getByTestId('force-click-enviar'));
    expect(screen.queryByText('TERMO DE COMPROMISSO DO PESQUISADOR CDEP')).not.toBeInTheDocument();
    unmountSemPermissao();

    mockUseParams.mockReturnValue({ id: '99' });
    const { unmount: unmountComId } = renderBtnEnviar([itemBibliograficoDisponivel], true);
    expect(screen.getByRole('button', { name: /enviar solicitação/i })).toBeDisabled();
    unmountComId();

    mockUseParams.mockReturnValue({});
    const { unmount: unmountVazio } = renderBtnEnviar([], true);
    expect(screen.getByRole('button', { name: /enviar solicitação/i })).toBeDisabled();
    unmountVazio();

    const { unmount: unmountIndisponivel } = renderBtnEnviar([itemBibliograficoIndisponivel], true);
    expect(screen.getByRole('button', { name: /enviar solicitação/i })).toBeDisabled();
    unmountIndisponivel();
  });

  it('C12: deve habilitar o botão "Enviar solicitação" para acervos bibliográficos disponíveis ou acervos não-bibliográficos', () => {
    const { unmount } = renderBtnEnviar([itemBibliograficoDisponivel], true);
    expect(screen.getByRole('button', { name: /enviar solicitação/i })).not.toBeDisabled();
    unmount();

    renderBtnEnviar([itemFotografico], true);
    expect(screen.getByRole('button', { name: /enviar solicitação/i })).not.toBeDisabled();
  });

  it('C13: deve abrir o modal ao clicar em "Enviar solicitação", buscar o termo de compromisso e tratar sucesso/falha', async () => {
    mockedObterTermo.mockResolvedValueOnce({
      sucesso: true,
      dados: '<p>Texto oficial do termo CDEP</p>',
      mensagens: [],
    });

    const { unmount } = renderBtnEnviar([itemBibliograficoDisponivel], true);

    fireEvent.click(screen.getByRole('button', { name: /enviar solicitação/i }));

    await waitFor(() => {
      expect(mockedObterTermo).toHaveBeenCalledTimes(1);
      expect(screen.getByText('TERMO DE COMPROMISSO DO PESQUISADOR CDEP')).toBeInTheDocument();
      expect(screen.getByText('Texto oficial do termo CDEP')).toBeInTheDocument();
    });

    unmount();
    mockedObterTermo.mockClear();

    // Fluxo quando obterTermoDeCompromisso retorna sucesso: false
    mockedObterTermo.mockResolvedValueOnce({
      sucesso: false,
      dados: '',
      mensagens: ['Erro ao buscar termo'],
    });

    renderBtnEnviar([itemBibliograficoDisponivel], true);
    fireEvent.click(screen.getByRole('button', { name: /enviar solicitação/i }));

    await waitFor(() => {
      expect(mockedObterTermo).toHaveBeenCalledTimes(1);
    });
    expect(screen.queryByText('Texto oficial do termo CDEP')).not.toBeInTheDocument();
  });

  it('C14: deve exigir aceite do checkbox no modal e, ao prosseguir com sucesso, inserir solicitação, limpar Redux, notificar e navegar', async () => {
    mockedObterTermo.mockResolvedValueOnce({
      sucesso: true,
      dados: '<p>Termo de compromisso</p>',
      mensagens: [],
    });
    mockedInserir.mockResolvedValueOnce({
      sucesso: true,
      dados: 555,
      mensagens: [],
    });

    renderBtnEnviar([itemBibliograficoDisponivel], true);

    fireEvent.click(screen.getByRole('button', { name: /enviar solicitação/i }));

    await waitFor(() => {
      expect(screen.getByText('Termo de compromisso')).toBeInTheDocument();
    });

    const btnProsseguir = screen.getByRole('button', { name: /prosseguir/i });
    expect(btnProsseguir).toBeDisabled();

    // Testa guarda defensiva if (!checked) return em validateFields
    fireEvent.click(screen.getByTestId('force-modal-ok'));
    expect(mockedInserir).not.toHaveBeenCalled();

    const checkbox = screen.getByRole('checkbox', {
      name: /li e estou de acordo com os termos/i,
    });
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    expect(btnProsseguir).not.toBeDisabled();

    fireEvent.click(btnProsseguir);

    await waitFor(() => {
      expect(mockedInserir).toHaveBeenCalledWith([{ acervoId: 101 }]);
      expect(mockDispatch).toHaveBeenCalledWith(setAcervosSelecionados([]));
      expect(mockNavigate).toHaveBeenCalledWith(`${ROUTES.SOLICITACAO}/555`, {
        state: { validarSeTemAnexos: true },
      });
      expect(notification.success).toHaveBeenCalledWith({
        message: 'Sucesso',
        description: 'Solicitação realizada com sucesso.',
      });
    });
  });

  it('C15: não deve limpar seleção nem navegar quando acervoSolicitacaoService.inserir retornar sucesso = false', async () => {
    mockedObterTermo.mockResolvedValueOnce({
      sucesso: true,
      dados: '<p>Termo</p>',
      mensagens: [],
    });
    mockedInserir.mockResolvedValueOnce({
      sucesso: false,
      dados: 0,
      mensagens: ['Falha ao inserir solicitação'],
    });

    renderBtnEnviar([itemBibliograficoDisponivel], true);

    fireEvent.click(screen.getByRole('button', { name: /enviar solicitação/i }));

    await waitFor(() => {
      expect(screen.getByText('Termo')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('checkbox', { name: /li e estou de acordo com os termos/i }));
    fireEvent.click(screen.getByRole('button', { name: /prosseguir/i }));

    await waitFor(() => {
      expect(mockedInserir).toHaveBeenCalledWith([{ acervoId: 101 }]);
    });

    expect(mockDispatch).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(notification.success).not.toHaveBeenCalled();
  });

  it('C16: deve fechar o modal e resetar o checkbox ao clicar em "Cancelar"', async () => {
    mockedObterTermo.mockResolvedValue({
      sucesso: true,
      dados: '<p>Termo</p>',
      mensagens: [],
    });

    renderBtnEnviar([itemBibliograficoDisponivel], true);

    fireEvent.click(screen.getByRole('button', { name: /enviar solicitação/i }));

    await waitFor(() => {
      expect(screen.getByText('Termo')).toBeInTheDocument();
    });

    const checkbox = screen.getByRole('checkbox', {
      name: /li e estou de acordo com os termos/i,
    });
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();

    fireEvent.click(screen.getByRole('button', { name: /cancelar/i }));

    // Reabre o modal e verifica que o checkbox foi resetado para desmarcado
    fireEvent.click(screen.getByRole('button', { name: /enviar solicitação/i }));

    await waitFor(() => {
      expect(
        screen.getByRole('checkbox', { name: /li e estou de acordo com os termos/i }),
      ).not.toBeChecked();
    });
  });
});
