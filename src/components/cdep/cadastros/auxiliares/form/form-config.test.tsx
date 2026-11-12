/**
 * @jest-environment jsdom
 */

jest.mock('react-router-dom', () => ({
  useLocation: jest.fn(),
}));

jest.mock('.', () => (props: any) => (
  <div data-testid="form">{props.page?.urlMainPage}</div>
));

jest.mock('~/core/constants/config-page-cadastros-auxiliares', () => ({
  paramsConfigPageFormCredito: { page: { urlMainPage: '/credito' } },
  paramsConfigPageFormAutor: { page: { urlMainPage: '/autor' } },
  paramsConfigPageFormEditora: { page: { urlMainPage: '/editora' } },
  paramsConfigPageFormAssunto: { page: { urlMainPage: '/assunto' } },
  paramsConfigPageFormSerieColecao: { page: { urlMainPage: '/serie' } },
}));

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FormConfigCadastrosAuxiliares from './form-config';
import { useLocation } from 'react-router-dom';

describe('FormConfigCadastrosAuxiliares', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar o form correto baseado na rota', () => {
    (useLocation as jest.Mock).mockReturnValue({
      pathname: '/cadastro/autor',
    });

    render(<FormConfigCadastrosAuxiliares />);

    expect(screen.getByTestId('form')).toHaveTextContent('/autor');
  });

  it('deve renderizar outro form conforme rota', () => {
    (useLocation as jest.Mock).mockReturnValue({
      pathname: '/cadastro/editora',
    });

    render(<FormConfigCadastrosAuxiliares />);

    expect(screen.getByTestId('form')).toHaveTextContent('/editora');
  });

  it('não deve renderizar nada quando não encontrar configuração', () => {
    (useLocation as jest.Mock).mockReturnValue({
      pathname: '/rota-invalida',
    });

    const { container } = render(<FormConfigCadastrosAuxiliares />);

    expect(container.innerHTML).toBe('');
  });
});