import { render, screen } from '~/tests/test-utils';
import { fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import BtnCancelarSolicitacoes from './';
import { AcervoSolicitacaoContext } from '../../provider';
import { PermissaoContext } from '~/routes/config/guard/permissao/provider';
import acervoSolicitacaoService from '~/core/services/acervo-solicitacao-service';
import { notification } from '~/components/lib/notification';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: '1' }),
}));

jest.mock('~/core/services/acervo-solicitacao-service', () => ({
  __esModule: true,
  default: {
    cancelarAtendimento: jest.fn(),
  },
}));

jest.mock('~/components/lib/notification', () => ({
  notification: {
    success: jest.fn(),
  },
}));

const defaultAcervoContext = {
  dataSource: [],
  setDataSource: jest.fn(),
  podeCancelarSolicitacao: true,
  setPodeCancelarSolicitacao: jest.fn(),
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

const renderComponent = (
  acervoContext = defaultAcervoContext,
  permissaoContext = defaultPermissaoContext,
) =>
  render(
    <AcervoSolicitacaoContext.Provider value={acervoContext}>
      <PermissaoContext.Provider value={permissaoContext}>
        <BtnCancelarSolicitacoes />
      </PermissaoContext.Provider>
    </AcervoSolicitacaoContext.Provider>,
  );

describe('BtnCancelarSolicitacoes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renderiza o botão "Cancelar solicitação"', () => {
    renderComponent();
    expect(screen.getByRole('button', { name: /cancelar solicitação/i })).toBeInTheDocument();
  });

  test('botão está desabilitado quando podeCancelarSolicitacao é false', () => {
    renderComponent({ ...defaultAcervoContext, podeCancelarSolicitacao: false });
    expect(screen.getByRole('button', { name: /cancelar solicitação/i })).toBeDisabled();
  });

  test('botão está desabilitado quando podeAlterar é false', () => {
    renderComponent(defaultAcervoContext, {
      ...defaultPermissaoContext,
      permissao: { ...defaultPermissaoContext.permissao, podeAlterar: false },
    });
    expect(screen.getByRole('button', { name: /cancelar solicitação/i })).toBeDisabled();
  });

  test('botão está habilitado quando podeCancelarSolicitacao e podeAlterar são true', () => {
    renderComponent();
    expect(screen.getByRole('button', { name: /cancelar solicitação/i })).not.toBeDisabled();
  });

  test('chama cancelarAtendimento com o id da rota ao clicar', async () => {
    (acervoSolicitacaoService.cancelarAtendimento as jest.Mock).mockResolvedValue({ sucesso: false });
    renderComponent();
    fireEvent.click(screen.getByRole('button', { name: /cancelar solicitação/i }));
    await waitFor(() => {
      expect(acervoSolicitacaoService.cancelarAtendimento).toHaveBeenCalledWith(1);
    });
  });

  test('exibe notificação de sucesso e navega para a página principal após cancelamento', async () => {
    (acervoSolicitacaoService.cancelarAtendimento as jest.Mock).mockResolvedValue({ sucesso: true });
    renderComponent();
    fireEvent.click(screen.getByRole('button', { name: /cancelar solicitação/i }));
    await waitFor(() => {
      expect(notification.success).toHaveBeenCalledWith({
        message: 'Sucesso',
        description: 'Solicitação cancelada com sucesso',
      });
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });
});
