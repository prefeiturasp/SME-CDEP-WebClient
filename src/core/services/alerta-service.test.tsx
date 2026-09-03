/**
 * @jest-environment jsdom
 */

jest.mock('antd', () => ({
  Modal: {
    confirm: jest.fn(),
  },
}));

jest.mock('../styles/colors', () => ({
  Colors: {
    Neutral: { DARK: '#000' },
    SystemSME: {
      CDEP: { PRIMARY: '#fff' },
    },
  },
}));

import { Modal } from 'antd';
import { confirmacao } from './alerta-service';

describe('confirmacao', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve chamar Modal.confirm com valores padrão', () => {
    confirmacao({ content: 'teste' } as any);

    expect(Modal.confirm).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Atenção',
        content: 'teste',
        okText: 'Sim',
        cancelText: 'Não',
        icon: null,
        width: 500,
      }),
    );
  });

  it('deve respeitar valores customizados', () => {
    confirmacao({
      title: 'Titulo',
      content: 'Conteudo',
      okText: 'OK',
      cancelText: 'Cancelar',
    } as any);

    expect(Modal.confirm).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Titulo',
        content: 'Conteudo',
        okText: 'OK',
        cancelText: 'Cancelar',
      }),
    );
  });

  it('deve aplicar estilos dos botões', () => {
    confirmacao({ content: 'teste' } as any);

    const call = (Modal.confirm as jest.Mock).mock.calls[0][0];

    expect(call.cancelButtonProps).toBeDefined();
    expect(call.okButtonProps).toBeDefined();
  });
});