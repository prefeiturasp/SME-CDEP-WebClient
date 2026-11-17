import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { HttpStatusCode } from 'axios';
import {
  CDEP_INPUT_CONFIRMAR_SENHA,
  CDEP_INPUT_SENHA,
  CDEP_INPUT_SENHA_ATUAL,
} from '~/core/constants/ids/input';
import { useAppSelector } from '~/core/hooks/use-redux';
import usuarioService from '~/core/services/usuario-service';
import ModalEditNovaSenhaButton from './modal-edit-nova-senha-button';

jest.mock('~/core/hooks/use-redux', () => ({
  useAppSelector: jest.fn(),
}));

jest.mock('~/components/lib/notification', () => ({
  notification: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('~/core/services/usuario-service', () => ({
  __esModule: true,
  default: {
    alterarSenha: jest.fn(),
  },
}));

describe('ModalEditNovaSenha & ModalEditNovaSenhaButton', () => {
  jest.setTimeout(30000);

  beforeEach(() => {
    jest.clearAllMocks();
    (useAppSelector as jest.Mock).mockImplementation((selector) =>
      selector({ auth: { usuarioLogin: 'diego.moreno' } }),
    );
  });

  it('C12/C13: abre modal, exibe requisitos de segurança e submete nova senha', async () => {
    (usuarioService.alterarSenha as jest.Mock).mockResolvedValue({
      status: HttpStatusCode.Ok,
      data: true,
    });

    render(<ModalEditNovaSenhaButton />);

    fireEvent.click(screen.getByRole('button', { name: 'Alterar' }));
    expect(screen.getByText('Requisitos de segurança da senha')).toBeInTheDocument();
    expect(screen.getByText('Uma letra maiúscula')).toBeInTheDocument();

    fireEvent.change(document.getElementById(CDEP_INPUT_SENHA_ATUAL) as HTMLInputElement, {
      target: { value: 'Senha@123' },
    });
    fireEvent.change(document.getElementById(CDEP_INPUT_SENHA) as HTMLInputElement, {
      target: { value: 'NovaSenha@1' },
    });
    fireEvent.change(document.getElementById(CDEP_INPUT_CONFIRMAR_SENHA) as HTMLInputElement, {
      target: { value: 'NovaSenha@1' },
    });

    const alterarButtons = screen.getAllByRole('button', { name: 'Alterar' });
    fireEvent.click(alterarButtons[alterarButtons.length - 1]);

    await waitFor(() => {
      expect(usuarioService.alterarSenha).toHaveBeenCalledWith('diego.moreno', {
        senhaAtual: 'Senha@123',
        senhaNova: 'NovaSenha@1',
        confirmarSenha: 'NovaSenha@1',
      });
    });

    await waitFor(() => {
      expect(screen.queryByText('Requisitos de segurança da senha')).not.toBeInTheDocument();
    });
  });
});
