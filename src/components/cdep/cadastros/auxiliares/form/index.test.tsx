/**
 * @jest-environment jsdom
 */

jest.mock('~/core/services/api', () => ({
  __esModule: true,
  obterRegistro: jest.fn(),
  inserirRegistro: jest.fn(),
  alterarRegistro: jest.fn(),
  deletarRegistro: jest.fn(),
}));

jest.mock('~/core/services/alerta-service', () => ({
  confirmacao: jest.fn(({ onOk }) => onOk && onOk()),
}));

jest.mock('~/components/lib/notification', () => ({
  notification: { success: jest.fn() },
}));

// ─── ANT DESIGN ────────────────────────────────────────────────────────────
jest.mock('antd', () => {
  const Mock = ({ children }: any) => <div>{children}</div>;

  const Input = ({ showCount, ...props }: any) => <input {...props} />;
  Input.TextArea = ({ showCount, ...props }: any) => <textarea {...props} />;

  const Modal = ({ children, onOk, onCancel }: any) => (
    <div>
      <button onClick={onOk}>ok</button>
      <button onClick={onCancel}>cancelar</button>
      {children}
    </div>
  );

  const Form: any = ({ children, onFinish }: any) => (
    <div>
      {children}
      <button onClick={() => onFinish && onFinish({})}>submit</button>
    </div>
  );

  const FormItem = ({ children }: any) => <div>{children}</div>;
  Form.Item = FormItem;
  Form.useWatch = jest.fn();

  return {
    __esModule: true,
    Col: Mock,
    Form,
    Input,
    Spin: Mock,
    Modal,
  };
});

jest.mock('antd/es/form/Form', () => ({
  useForm: () => [
    {
      getFieldValue: jest.fn(),
      getFieldsValue: jest.fn(() => ({})),
      isFieldsTouched: jest.fn(() => true),
      resetFields: jest.fn(),
      validateFields: jest.fn().mockResolvedValue({}),
    },
  ],
}));

// ─── ROUTER ───────────────────────────────────────────────────────────────
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: jest.fn(() => ({})),
}));

// ─── CONTEXT ──────────────────────────────────────────────────────────────
jest.mock('~/routes/config/guard/permissao/provider', () => {
  const React = require('react');
  return {
    PermissaoContext: React.createContext({
      desabilitarCampos: false,
      permissao: { podeExcluir: true },
    }),
  };
});

// ─── UI SIMPLES ───────────────────────────────────────────────────────────
jest.mock('~/components/cdep/text/auditoria', () => () => <div>auditoria</div>);
jest.mock('~/components/lib/card-content', () => (props: any) => <div>{props.children}</div>);
jest.mock('~/components/lib/header-page', () => (props: any) => (
  <div>
    <h1>{props.title}</h1>
    {props.children}
  </div>
));
jest.mock('./botoes-acoes', () => (props: any) => (
  <div>
    <button onClick={props.onClickExcluir}>excluir</button>
    <button onClick={props.onClickVoltar}>voltar</button>
    <button onClick={props.onClickCancelar}>cancelar</button>
  </div>
));

// ─── IMPORT ───────────────────────────────────────────────────────────────
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import FormCadastrosAuxiliares from './index';

// ─── DEFAULT PROPS ─────────────────────────────────────────────────────────
const defaultProps = {
  page: {
    urlBase: '/teste',
    urlMainPage: '/lista',
    title: 'Cadastro',
    inputs: [{ name: 'nome', placeholder: 'Nome' }],
  },
  title: 'Modal',
  maxLength: 100,
};

// ─── TESTES ────────────────────────────────────────────────────────────────
describe('FormCadastrosAuxiliares', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar corretamente', () => {
    render(<FormCadastrosAuxiliares {...defaultProps} />);
    expect(screen.getByText('Cadastro')).toBeInTheDocument();
  });

  it('deve carregar dados quando existir id', async () => {
    const router = require('react-router-dom');
    const { obterRegistro } = require('~/core/services/api');

    router.useParams.mockReturnValue({ id: '1' });

    obterRegistro.mockResolvedValue({
      sucesso: true,
      dados: { nome: 'Teste' },
    });

    render(<FormCadastrosAuxiliares {...defaultProps} />);

    await waitFor(() => {
      expect(obterRegistro).toHaveBeenCalledWith('/teste/1');
    });
  });

  it('deve alterar registro quando houver id', async () => {
    const router = require('react-router-dom');
    const { alterarRegistro } = require('~/core/services/api');

    router.useParams.mockReturnValue({ id: '1' });

    alterarRegistro.mockResolvedValue({ sucesso: true });

    render(<FormCadastrosAuxiliares {...defaultProps} isModal />);

    fireEvent.click(screen.getByText('ok'));

    await waitFor(() => {
      expect(alterarRegistro).toHaveBeenCalled();
    });
  });

  it('deve excluir registro', async () => {
    const router = require('react-router-dom');
    const { deletarRegistro } = require('~/core/services/api');

    router.useParams.mockReturnValue({ id: '1' });

    deletarRegistro.mockResolvedValue({ sucesso: true });

    render(<FormCadastrosAuxiliares {...defaultProps} />);

    fireEvent.click(screen.getByText('excluir'));

    await waitFor(() => {
      expect(deletarRegistro).toHaveBeenCalled();
    });
  });

  it('deve navegar ao voltar', () => {
    render(<FormCadastrosAuxiliares {...defaultProps} />);

    fireEvent.click(screen.getByText('voltar'));

    expect(mockNavigate).toHaveBeenCalledWith('/lista');
  });

  it('deve cancelar no modal', () => {
    const setOpenModal = jest.fn();

    render(
      <FormCadastrosAuxiliares
        {...defaultProps}
        isModal
        setOpenModal={setOpenModal}
      />,
    );

    fireEvent.click(screen.getByText('cancelar'));

    expect(setOpenModal).toHaveBeenCalled();
  });
});