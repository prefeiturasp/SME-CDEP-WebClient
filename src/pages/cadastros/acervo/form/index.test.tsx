import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FormAcervo from './index';
import * as api from '~/core/services/api';
import { PermissaoContext } from '~/routes/config/guard/permissao/provider';

jest.mock('~/core/services/api', () => ({
  inserirRegistro: jest.fn(),
  alterarRegistro: jest.fn(),
  obterRegistro: jest.fn(),
}));

jest.mock('~/components/lib/notification', () => ({
  notification: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
  useLocation: () => ({ state: {} }),
  useParams: () => ({}),
}));

jest.mock('~/core/enum/tipo-acervo', () => ({
  TipoAcervo: {
    Fotografico: '1',
  },
}));

jest.mock('~/components/cdep/input/tipo-acervo', () => {
  const { Form } = require('antd');
  return {
    __esModule: true,
    default: ({ formItemProps }: any) => (
      <Form.Item {...formItemProps}>
        <select data-testid="tipo-acervo">
          <option value="1">Fotografico</option>
        </select>
      </Form.Item>
    ),
  };
});

jest.mock('./form-content-cadastro-acervo', () => () => <div>form-content</div>);
jest.mock('~/components/cdep/text/auditoria', () => () => <div>auditoria</div>);
jest.mock('~/components/lib/card-content', () => ({ children }: any) => <div>{children}</div>);
jest.mock('./form-header-cadastro-acervo', () => () => <div>header</div>);

describe('FormAcervo', () => {
  it('deve submeter e chamar inserirRegistro', async () => {
    const mockInserir = api.inserirRegistro as jest.Mock;
    mockInserir.mockResolvedValue({ sucesso: true });

    render(
      <PermissaoContext.Provider value={{ desabilitarCampos: false }}>
        <FormAcervo />
      </PermissaoContext.Provider>
    );

    fireEvent.change(screen.getByTestId('tipo-acervo'), {
      target: { value: '1' },
    });

    await waitFor(async () => {
      fireEvent.submit(document.querySelector('form')!);
    });

    await waitFor(() => {
      expect(mockInserir).toHaveBeenCalled();
    });
  });
});