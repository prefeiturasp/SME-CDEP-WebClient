import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { CDEP_BUTTON_NOVO } from '~/core/constants/ids/button/intex';
import {
  AcervoDisponibilidadeEnumDisplay,
  AcervoDisponibilidadeSituacaoEnum,
} from '~/core/enum/acervo-disponibilidade-enum';
import { ROUTES } from '~/core/enum/routes';
import { TipoAcervo } from '~/core/enum/tipo-acervo';
import { setAcervosSelecionados } from '~/core/redux/modules/solicitacao/actions';
import { obterTermoDeCompromisso } from '~/core/services/acervo-service';
import acervoSolicitacaoService from '~/core/services/acervo-solicitacao-service';
import { notification } from '~/components/lib/notification';
import { PermissaoContext } from '~/routes/config/guard/permissao/provider';
import { AcervoSolicitacaoContext } from '../../provider';
import BtnEnviarSolicitacoes from './index';

let mockParams: { id?: string } = {};
const mockNavigate = jest.fn();
const mockDispatch = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => mockParams,
}));

jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
}));

jest.mock('~/core/redux/modules/solicitacao/actions', () => ({
  setAcervosSelecionados: jest.fn((val) => ({
    type: 'SET_ACERVOS_SELECIONADOS',
    payload: val,
  })),
}));

jest.mock('~/core/services/acervo-service', () => ({
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
    error: jest.fn(),
  },
}));

jest.mock('~/components/cdep/spin', () => ({
  __esModule: true,
  default: ({ children }: any) => <div data-testid='mock-spin'>{children}</div>,
}));

jest.mock('antd/es/checkbox/Checkbox', () => {
  return function MockCheckbox({ checked, onChange, children, disabled }: any) {
    return (
      <label>
        <input
          type='checkbox'
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange?.({ target: { checked: e.target.checked } })}
        />
        {children}
      </label>
    );
  };
});

jest.mock('~/components/lib/modal', () => {
  return function MockModal({
    open,
    title,
    onOk,
    onCancel,
    children,
    okButtonProps,
    cancelButtonProps,
  }: any) {
    if (!open) return null;
    return (
      <div data-testid='mock-modal' role='dialog' aria-label={title}>
        <div>{title}</div>
        <div>{children}</div>
        <button
          type='button'
          data-testid='btn-modal-cancel'
          onClick={onCancel}
          disabled={cancelButtonProps?.disabled}
        >
          Cancelar
        </button>
        <button
          type='button'
          data-testid='btn-modal-ok'
          onClick={onOk}
          data-disabled={okButtonProps?.disabled}
        >
          Prosseguir
        </button>
      </div>
    );
  };
});

describe('BtnEnviarSolicitacoes', () => {
  const defaultDataSource = [
    {
      acervoId: 10,
      tipoAcervoId: TipoAcervo.Bibliografico,
      situacaoDisponibilidade:
        AcervoDisponibilidadeEnumDisplay[AcervoDisponibilidadeSituacaoEnum.DISPONIVEL],
    },
    {
      acervoId: 20,
      tipoAcervoId: TipoAcervo.Audiovisual,
      situacaoDisponibilidade:
        AcervoDisponibilidadeEnumDisplay[AcervoDisponibilidadeSituacaoEnum.DISPONIVEL],
    },
  ];

  const defaultAcervoContext = {
    dataSource: defaultDataSource,
    setDataSource: jest.fn(),
    podeCancelarSolicitacao: false,
    setPodeCancelarSolicitacao: jest.fn(),
    carregarDados: jest.fn(),
  };

  const defaultPermissaoContext = {
    desabilitarCampos: false,
    setDesabilitarCampos: jest.fn(),
    permissao: {
      customRoles: [],
      podeAlterar: true,
      podeConsultar: true,
      podeExcluir: true,
      podeIncluir: true,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockParams = {};
    (obterTermoDeCompromisso as jest.Mock).mockResolvedValue({
      sucesso: true,
      dados: '<p>Termo de Compromisso de Teste</p>',
    });
  });

  const renderComponent = (
    acervoContext: any = defaultAcervoContext,
    permissaoContext: any = defaultPermissaoContext,
  ) =>
    render(
      <AcervoSolicitacaoContext.Provider value={acervoContext}>
        <PermissaoContext.Provider value={permissaoContext}>
          <BtnEnviarSolicitacoes />
        </PermissaoContext.Provider>
      </AcervoSolicitacaoContext.Provider>,
    );

  describe('Renderização e Habilitação do Botão', () => {
    it('deve renderizar o botão "Enviar solicitação" habilitado quando todas as condições forem válidas', () => {
      renderComponent();

      const btn = document.getElementById(CDEP_BUTTON_NOVO)!;
      expect(btn).toBeInTheDocument();
      expect(btn).toHaveTextContent('Enviar solicitação');
      expect(btn).not.toBeDisabled();
    });

    it('deve desabilitar o botão quando podeIncluir for falso', () => {
      renderComponent(defaultAcervoContext, {
        ...defaultPermissaoContext,
        permissao: { ...defaultPermissaoContext.permissao, podeIncluir: false },
      });

      expect(document.getElementById(CDEP_BUTTON_NOVO)).toBeDisabled();
    });

    it('deve desabilitar o botão quando permissao for indefinido', () => {
      renderComponent(defaultAcervoContext, {
        ...defaultPermissaoContext,
        permissao: undefined,
      });

      expect(document.getElementById(CDEP_BUTTON_NOVO)).toBeDisabled();
    });

    it('deve desabilitar o botão quando solicitacaoId na rota for maior que 0', () => {
      mockParams = { id: '99' };
      renderComponent();

      expect(document.getElementById(CDEP_BUTTON_NOVO)).toBeDisabled();
    });

    it('deve desabilitar o botão quando dataSource estiver vazio', () => {
      renderComponent({
        ...defaultAcervoContext,
        dataSource: [],
      });

      expect(document.getElementById(CDEP_BUTTON_NOVO)).toBeDisabled();
    });

    it('deve desabilitar o botão quando dataSource for indefinido', () => {
      renderComponent({
        ...defaultAcervoContext,
        dataSource: undefined,
      });

      expect(document.getElementById(CDEP_BUTTON_NOVO)).toBeDisabled();
    });

    it('deve desabilitar o botão quando houver item bibliográfico indisponível', () => {
      renderComponent({
        ...defaultAcervoContext,
        dataSource: [
          {
            acervoId: 10,
            tipoAcervoId: TipoAcervo.Bibliografico,
            situacaoDisponibilidade: 'Emprestado',
          },
        ],
      });

      expect(document.getElementById(CDEP_BUTTON_NOVO)).toBeDisabled();
    });

    it('deve manter o botão habilitado quando houver item indisponível mas não for bibliográfico', () => {
      renderComponent({
        ...defaultAcervoContext,
        dataSource: [
          {
            acervoId: 30,
            tipoAcervoId: TipoAcervo.Audiovisual,
            situacaoDisponibilidade: 'Consultado',
          },
        ],
      });

      expect(document.getElementById(CDEP_BUTTON_NOVO)).not.toBeDisabled();
    });
  });

  describe('Abertura do Modal e Carregamento do Termo', () => {
    it('deve abrir o modal ao clicar no botão "Enviar solicitação" e carregar o termo de compromisso', async () => {
      renderComponent();

      fireEvent.click(document.getElementById(CDEP_BUTTON_NOVO)!);

      expect(screen.getByTestId('mock-modal')).toBeInTheDocument();
      expect(screen.getByText('TERMO DE COMPROMISSO DO PESQUISADOR CDEP')).toBeInTheDocument();

      await waitFor(() => {
        expect(obterTermoDeCompromisso).toHaveBeenCalled();
        expect(screen.getByText('Termo de Compromisso de Teste')).toBeInTheDocument();
      });
    });

    it('não deve quebrar quando obterTermoDeCompromisso retornar sucesso false', async () => {
      (obterTermoDeCompromisso as jest.Mock).mockResolvedValueOnce({
        sucesso: false,
      });

      renderComponent();

      fireEvent.click(document.getElementById(CDEP_BUTTON_NOVO)!);

      await waitFor(() => {
        expect(obterTermoDeCompromisso).toHaveBeenCalled();
      });

      expect(screen.queryByText('Termo de Compromisso de Teste')).not.toBeInTheDocument();
    });

    it('não deve abrir o modal se permissao.podeIncluir for falso', () => {
      renderComponent(defaultAcervoContext, {
        ...defaultPermissaoContext,
        permissao: { ...defaultPermissaoContext.permissao, podeIncluir: false },
      });

      // Botão está desabilitado, mas disparar o onClick diretamente testa o guard da função
      const btn = document.getElementById(CDEP_BUTTON_NOVO)!;
      fireEvent.click(btn);

      expect(screen.queryByTestId('mock-modal')).not.toBeInTheDocument();
    });
  });

  describe('Fechamento e Cancelamento do Modal', () => {
    it('deve fechar o modal e desmarcar o checkbox ao clicar em Cancelar', async () => {
      renderComponent();

      fireEvent.click(document.getElementById(CDEP_BUTTON_NOVO)!);

      await waitFor(() => {
        expect(screen.getByTestId('mock-modal')).toBeInTheDocument();
      });

      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);
      expect(checkbox).toBeChecked();

      fireEvent.click(screen.getByTestId('btn-modal-cancel'));

      expect(screen.queryByTestId('mock-modal')).not.toBeInTheDocument();

      // Abrir novamente para verificar se o checkbox foi desmarcado
      fireEvent.click(document.getElementById(CDEP_BUTTON_NOVO)!);
      await waitFor(() => {
        expect(screen.getByRole('checkbox')).not.toBeChecked();
      });
    });
  });

  describe('Validação e Envio da Solicitação (validateFields)', () => {
    it('não deve enviar a solicitação se o checkbox não estiver marcado', async () => {
      renderComponent();

      fireEvent.click(document.getElementById(CDEP_BUTTON_NOVO)!);

      await waitFor(() => {
        expect(screen.getByTestId('mock-modal')).toBeInTheDocument();
      });

      // Botão Prosseguir está com disabled true em okButtonProps quando checked é false
      const btnProsseguir = screen.getByTestId('btn-modal-ok');
      expect(btnProsseguir).toHaveAttribute('data-disabled', 'true');

      fireEvent.click(btnProsseguir);

      expect(acervoSolicitacaoService.inserir).not.toHaveBeenCalled();
    });

    it('deve enviar a solicitação com sucesso, limpar acervos selecionados, navegar e exibir notificação', async () => {
      (acervoSolicitacaoService.inserir as jest.Mock).mockResolvedValueOnce({
        sucesso: true,
        dados: 789,
      });

      renderComponent();

      fireEvent.click(document.getElementById(CDEP_BUTTON_NOVO)!);

      await waitFor(() => {
        expect(screen.getByTestId('mock-modal')).toBeInTheDocument();
      });

      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);
      expect(checkbox).toBeChecked();

      const btnProsseguir = screen.getByTestId('btn-modal-ok');
      expect(btnProsseguir).toHaveAttribute('data-disabled', 'false');

      fireEvent.click(btnProsseguir);

      await waitFor(() => {
        expect(acervoSolicitacaoService.inserir).toHaveBeenCalledWith([
          { acervoId: 10 },
          { acervoId: 20 },
        ]);
        expect(mockDispatch).toHaveBeenCalledWith(setAcervosSelecionados([]));
        expect(mockNavigate).toHaveBeenCalledWith(`${ROUTES.SOLICITACAO}/789`, {
          state: { validarSeTemAnexos: true },
        });
        expect(notification.success).toHaveBeenCalledWith(
          expect.objectContaining({
            description: 'Solicitação realizada com sucesso.',
          }),
        );
      });

      expect(screen.queryByTestId('mock-modal')).not.toBeInTheDocument();
    });

    it('não deve navegar nem exibir notificação se o serviço inserir retornar sucesso false', async () => {
      (acervoSolicitacaoService.inserir as jest.Mock).mockResolvedValueOnce({
        sucesso: false,
      });

      renderComponent();

      fireEvent.click(document.getElementById(CDEP_BUTTON_NOVO)!);

      await waitFor(() => {
        expect(screen.getByTestId('mock-modal')).toBeInTheDocument();
      });

      const checkbox = screen.getByRole('checkbox');
      fireEvent.click(checkbox);

      const btnProsseguir = screen.getByTestId('btn-modal-ok');
      fireEvent.click(btnProsseguir);

      await waitFor(() => {
        expect(acervoSolicitacaoService.inserir).toHaveBeenCalled();
      });

      expect(mockDispatch).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
      expect(notification.success).not.toHaveBeenCalled();
      expect(screen.getByTestId('mock-modal')).toBeInTheDocument();
    });
  });
});
