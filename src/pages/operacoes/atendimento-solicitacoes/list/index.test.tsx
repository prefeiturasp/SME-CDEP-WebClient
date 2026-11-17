import { AnyAction, configureStore, Reducer } from '@reduxjs/toolkit';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import {
  CDEP_BUTTON_CANCELAR,
  CDEP_BUTTON_NOVA_SOLICITACAO,
  CDEP_BUTTON_VOLTAR,
} from '~/core/constants/ids/button/intex';
import { CDEP_INPUT_NUMERO_SOLICITACAO } from '~/core/constants/ids/input';
import { URL_API_ACERVO_SOLICITACAO } from '~/core/constants/urls-api';
import { PerfilUsuarioDTO } from '~/core/dto/perfil-usuario-dto';
import { ROUTES } from '~/core/enum/routes';
import { TipoPerfil } from '~/core/enum/tipo-perfil-enum';
import perfilReducer from '~/core/redux/modules/perfil/reducers';
import { obterSituacoesEmprestimo } from '~/core/services/acervo-emprestimo';
import { obterTiposAcervo } from '~/core/services/acervo-service';
import acervoSolicitacaoService from '~/core/services/acervo-solicitacao-service';
import api from '~/core/services/api';
import usuarioService from '~/core/services/usuario-service';
import { PermissaoContext } from '~/routes/config/guard/permissao/provider';
import { ListAtendimentoSolicitacoes } from './index';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('query-string', () => ({
  __esModule: true,
  default: {
    stringify: jest.fn(() => 'mock'),
  },
}));

jest.mock('antd/es/table', () => jest.requireActual('antd/lib/table'));
jest.mock('antd/es/select', () => jest.requireActual('antd/lib/select'));
jest.mock('antd/es/date-picker', () => jest.requireActual('antd/lib/date-picker'));
jest.mock('antd/es/date-picker/locale/pt_BR', () =>
  jest.requireActual('antd/lib/date-picker/locale/pt_BR'),
);
jest.mock('antd/es/form/Form', () => jest.requireActual('antd/lib/form/Form'));
jest.mock('antd/es/form/hooks/useFormInstance', () =>
  jest.requireActual('antd/lib/form/hooks/useFormInstance'),
);

jest.mock('~/components/lib/button/secundary', () => {
  const ActualButtonSecundary = jest.requireActual('~/components/lib/button/secundary').default;
  return {
    __esModule: true,
    default: (props: Record<string, unknown>) => (
      <>
        <ActualButtonSecundary {...props} />
        <button
          type='button'
          data-testid='force-click-cancelar'
          style={{ display: 'none' }}
          onClick={props.onClick as () => void}
        />
      </>
    ),
  };
});

jest.mock('~/core/services/api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

jest.mock('~/core/services/acervo-service', () => ({
  __esModule: true,
  obterTiposAcervo: jest.fn(),
}));

jest.mock('~/core/services/usuario-service', () => ({
  __esModule: true,
  default: {
    obterPerfisResponsaveis: jest.fn(),
    obterRfCpf: jest.fn(),
  },
}));

jest.mock('~/core/services/acervo-solicitacao-service', () => ({
  __esModule: true,
  default: {
    obterSituacoesAtendimento: jest.fn(),
  },
}));

jest.mock('~/core/services/acervo-emprestimo', () => ({
  __esModule: true,
  obterSituacoesEmprestimo: jest.fn(),
}));

type PerfilStorageState = {
  perfis: PerfilUsuarioDTO[];
  perfilSelecionado: PerfilUsuarioDTO | null;
};

const mockedApiGet = api.get as jest.Mock;
const mockedObterTiposAcervo = obterTiposAcervo as jest.Mock;
const mockedObterResponsaveis = usuarioService.obterPerfisResponsaveis as jest.Mock;
const mockedObterRfCpf = usuarioService.obterRfCpf as jest.Mock;
const mockedObterSituacoesAtendimento =
  acervoSolicitacaoService.obterSituacoesAtendimento as jest.Mock;
const mockedObterSituacoesEmprestimo = obterSituacoesEmprestimo as jest.Mock;

const tituloLongo = 'A'.repeat(120);

const mockItensTabela = [
  {
    id: 1,
    acervoSolicitacaoId: 501,
    tipoAcervo: 'Bibliográfico',
    titulo: 'Acervo Curto Histórico',
    dataCriacao: '10/11/2026',
    solicitante: 'Ana Paula',
    responsavel: 'Carlos Técnico',
    dataVisita: '15/11/2026',
    situacao: 'Aguardando Atendimento',
    situacaoEmprestimo: 'Não emprestado',
  },
  {
    id: 2,
    acervoSolicitacaoId: 502,
    tipoAcervo: 'Fotográfico',
    titulo: tituloLongo,
    dataCriacao: '11/11/2026',
    solicitante: 'Bruno Souza',
    responsavel: 'Mariana Técnica',
    dataVisita: '',
    situacao: 'Em análise',
    situacaoEmprestimo: '',
  },
];

const renderPage = ({
  podeIncluir = true,
  perfilSelecionado = {
    perfil: TipoPerfil.ADMIN_GERAL,
    perfilNome: 'Admin Geral',
  },
}: {
  podeIncluir?: boolean;
  perfilSelecionado?: PerfilUsuarioDTO | null;
} = {}) => {
  const store = configureStore({
    reducer: {
      perfil: perfilReducer as unknown as Reducer<PerfilStorageState, AnyAction>,
    },
    preloadedState: {
      perfil: {
        perfis: [],
        perfilSelecionado,
      },
    },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter>
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
          <ListAtendimentoSolicitacoes />
        </PermissaoContext.Provider>
      </MemoryRouter>
    </Provider>,
  );
};

describe('ListAtendimentoSolicitacoes (src/pages/operacoes/atendimento-solicitacoes/list/index.tsx)', () => {
  jest.setTimeout(45000);

  beforeEach(() => {
    mockNavigate.mockReset();
    mockedApiGet.mockReset();
    mockedObterTiposAcervo.mockReset();
    mockedObterResponsaveis.mockReset();
    mockedObterRfCpf.mockReset();
    mockedObterSituacoesAtendimento.mockReset();
    mockedObterSituacoesEmprestimo.mockReset();

    mockedObterTiposAcervo.mockResolvedValue({
      sucesso: true,
      dados: [{ id: 1, nome: 'Bibliográfico' }],
    });
    mockedObterResponsaveis.mockResolvedValue({
      sucesso: true,
      dados: [{ nome: 'Carlos Técnico', login: 'carlos.tecnico' }],
    });
    mockedObterSituacoesAtendimento.mockResolvedValue({
      sucesso: true,
      dados: [{ id: 2, nome: 'Aguardando Atendimento' }],
    });
    mockedObterSituacoesEmprestimo.mockResolvedValue({
      sucesso: true,
      dados: [{ id: 3, nome: 'Emprestado' }],
    });
    mockedApiGet.mockResolvedValue({
      data: {
        items: mockItensTabela,
        totalRegistros: 2,
      },
    });
  });

  it('C03 e C08: deve renderizar título, filtros, DataTable e formatar título curto, título longo (>100 chars) e dataVisita', async () => {
    renderPage();

    expect(screen.getByText('Atendimento de Solicitações')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('N° da solicitação')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Nome do solicitante')).toBeDisabled();

    await waitFor(() => {
      expect(mockedApiGet).toHaveBeenCalledWith(
        expect.stringContaining(`${URL_API_ACERVO_SOLICITACAO}/atendimento-solicitacoes`),
        expect.objectContaining({
          params: expect.objectContaining({
            acervoSolicitacaoId: null,
            tipoAcervo: null,
          }),
        }),
      );
      expect(screen.getByText('Acervo Curto Histórico')).toBeInTheDocument();
    });

    expect(screen.getByText(`${'A'.repeat(100)}...`)).toBeInTheDocument();
    expect(screen.getByText('15/11/2026')).toBeInTheDocument();
  }, 15000);

  it('C04: botão Voltar deve navegar para ROUTES.INDICADORES para perfil admin e para ROUTES.PRINCIPAL para perfil comum', async () => {
    const { container, unmount } = renderPage({
      perfilSelecionado: {
        perfil: TipoPerfil.ADMIN_GERAL,
        perfilNome: 'Admin Geral',
      },
    });

    await waitFor(() => expect(mockedApiGet).toHaveBeenCalled());

    fireEvent.click(container.querySelector(`#${CDEP_BUTTON_VOLTAR}`) as HTMLButtonElement);
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.INDICADORES);

    unmount();
    mockNavigate.mockReset();

    const { container: containerComum } = renderPage({
      perfilSelecionado: {
        perfil: TipoPerfil.EXTERNO,
        perfilNome: 'Externo',
      },
    });

    await waitFor(() => expect(mockedApiGet).toHaveBeenCalled());

    fireEvent.click(containerComum.querySelector(`#${CDEP_BUTTON_VOLTAR}`) as HTMLButtonElement);
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.PRINCIPAL);
  });

  it('C05: botão "Nova solicitação" deve respeitar permissão podeIncluir e navegar para ROUTES.ATENDIMENTO_SOLICITACAO_MANUAL', async () => {
    const { container, unmount } = renderPage({ podeIncluir: true });
    await waitFor(() => expect(mockedApiGet).toHaveBeenCalled());

    const btnNova = container.querySelector(
      `#${CDEP_BUTTON_NOVA_SOLICITACAO}`,
    ) as HTMLButtonElement;
    expect(btnNova).not.toBeDisabled();

    fireEvent.click(btnNova);
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.ATENDIMENTO_SOLICITACAO_MANUAL);

    unmount();

    const { container: containerSemPerm } = renderPage({ podeIncluir: false });
    await waitFor(() => expect(mockedApiGet).toHaveBeenCalled());

    const btnNovaDesabilitado = containerSemPerm.querySelector(
      `#${CDEP_BUTTON_NOVA_SOLICITACAO}`,
    ) as HTMLButtonElement;
    expect(btnNovaDesabilitado).toBeDisabled();
  });

  it('C06 e C10: deve atualizar filters ao alterar campos, habilitar botão Cancelar, e resetar para DEFAULT_VALUES ao clicar em Cancelar', async () => {
    const { container } = renderPage();
    await waitFor(() => expect(mockedApiGet).toHaveBeenCalled());

    const btnCancelar = container.querySelector(`#${CDEP_BUTTON_CANCELAR}`) as HTMLButtonElement;
    expect(btnCancelar).toBeDisabled();

    // Testa guarda defensiva if (form.isFieldsTouched()) em onClickCancelar
    const callsBeforeForceCancel = mockedApiGet.mock.calls.length;
    fireEvent.click(screen.getByTestId('force-click-cancelar'));
    expect(mockedApiGet).toHaveBeenCalledTimes(callsBeforeForceCancel);

    const inputNumero = container.querySelector(
      `#${CDEP_INPUT_NUMERO_SOLICITACAO}`,
    ) as HTMLInputElement;
    fireEvent.change(inputNumero, { target: { value: '1234' } });

    await waitFor(() => {
      expect(mockedApiGet).toHaveBeenLastCalledWith(
        expect.any(String),
        expect.objectContaining({
          params: expect.objectContaining({
            acervoSolicitacaoId: '1234',
          }),
        }),
      );
      expect(btnCancelar).not.toBeDisabled();
    });

    fireEvent.click(btnCancelar);

    await waitFor(() => {
      expect(mockedApiGet).toHaveBeenLastCalledWith(
        expect.any(String),
        expect.objectContaining({
          params: expect.objectContaining({
            acervoSolicitacaoId: null,
            tipoAcervo: null,
          }),
        }),
      );
      expect(btnCancelar).toBeDisabled();
    });
  });

  it('C07: busca em InputRfCpfSolicitante com sucesso preenche Nome do solicitante e atualiza filtros no DataTable', async () => {
    mockedObterRfCpf.mockResolvedValueOnce({
      sucesso: true,
      dados: { nome: 'Pesquisador CDEP' },
    });

    renderPage();
    await waitFor(() => expect(mockedApiGet).toHaveBeenCalled());

    const inputRf = screen.getByPlaceholderText('Informe o RF ou CPF do Solicitante');
    fireEvent.change(inputRf, { target: { value: '12345678901' } });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    await waitFor(() => {
      expect(mockedObterRfCpf).toHaveBeenCalledWith('12345678901');
      expect(screen.getByPlaceholderText('Nome do solicitante')).toHaveValue('Pesquisador CDEP');
      expect(mockedApiGet).toHaveBeenLastCalledWith(
        expect.any(String),
        expect.objectContaining({
          params: expect.objectContaining({
            solicitanteRf: '12345678901',
          }),
        }),
      );
    });
  });

  it('C09: clicar em uma linha da tabela navega para detalhes da solicitação com replace: true', async () => {
    renderPage();

    await waitFor(() => {
      expect(screen.getByText('Acervo Curto Histórico')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Acervo Curto Histórico'));

    expect(mockNavigate).toHaveBeenCalledWith(`${ROUTES.ATENDIMENTO_SOLICITACOES}/501`, {
      replace: true,
    });
  });
});
