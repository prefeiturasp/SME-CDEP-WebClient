/**
 * @jest-environment jsdom
 */

jest.mock('antd', () => {
  const Mock = ({ children }: any) => <div>{children}</div>;

  const Form: any = ({ children }: any) => <div>{children}</div>;
  Form.Item = ({ children }: any) => (
    <div>{typeof children === 'function' ? children() : children}</div>
  );

  return {
    __esModule: true,
    Button: ({ children, block, htmlType, ...rest }: any) => (
      <button type={htmlType} {...rest}>
        {children}
      </button>
    ),
    Col: Mock,
    Row: Mock,
    Form,
  };
});

jest.mock('~/components/cdep/button/voltar', () => (props: any) => (
  <button onClick={props.onClick}>voltar</button>
));

jest.mock('~/components/cdep/button/excluir', () => (props: any) => (
  <button onClick={props.onClick} disabled={props.disabled}>
    excluir
  </button>
));

jest.mock('~/routes/config/guard/permissao/provider', () => {
  const React = require('react');
  return {
    PermissaoContext: React.createContext({
      permissao: { podeExcluir: true },
    }),
  };
});

import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FormCadastrosAuxiliaresBotoesAcoes from './botoes-acoes';

describe('FormCadastrosAuxiliaresBotoesAcoes', () => {
  const defaultProps = {
    id: 1,
    form: {
      isFieldsTouched: jest.fn(() => true),
    } as any,
    onClickVoltar: jest.fn(),
    onClickExcluir: jest.fn(),
    onClickCancelar: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar botões corretamente com id', () => {
    render(<FormCadastrosAuxiliaresBotoesAcoes {...defaultProps} />);

    expect(screen.getByText('voltar')).toBeInTheDocument();
    expect(screen.getByText('excluir')).toBeInTheDocument();
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
    expect(screen.getByText('Alterar')).toBeInTheDocument();
  });

  it('não deve mostrar botão excluir sem id', () => {
    render(
      <FormCadastrosAuxiliaresBotoesAcoes {...defaultProps} id={0} />,
    );

    expect(screen.queryByText('excluir')).not.toBeInTheDocument();
    expect(screen.getByText('Salvar')).toBeInTheDocument();
  });

  it('deve chamar voltar', () => {
    render(<FormCadastrosAuxiliaresBotoesAcoes {...defaultProps} />);

    fireEvent.click(screen.getByText('voltar'));

    expect(defaultProps.onClickVoltar).toHaveBeenCalled();
  });

  it('deve chamar excluir', () => {
    render(<FormCadastrosAuxiliaresBotoesAcoes {...defaultProps} />);

    fireEvent.click(screen.getByText('excluir'));

    expect(defaultProps.onClickExcluir).toHaveBeenCalled();
  });

  it('deve chamar cancelar', () => {
    render(<FormCadastrosAuxiliaresBotoesAcoes {...defaultProps} />);

    fireEvent.click(screen.getByText('Cancelar'));

    expect(defaultProps.onClickCancelar).toHaveBeenCalled();
  });

  it('deve desabilitar cancelar quando form não foi alterado', () => {
    const form = {
      isFieldsTouched: jest.fn(() => false),
    };

    render(
      <FormCadastrosAuxiliaresBotoesAcoes
        {...defaultProps}
        form={form as any}
      />,
    );

    expect(screen.getByText('Cancelar')).toBeDisabled();
  });

  it('deve desabilitar excluir sem permissão', () => {
    const React = require('react');
    const { PermissaoContext } = require('~/routes/config/guard/permissao/provider');

    render(
      <PermissaoContext.Provider value={{ permissao: { podeExcluir: false } }}>
        <FormCadastrosAuxiliaresBotoesAcoes {...defaultProps} />
      </PermissaoContext.Provider>,
    );

    expect(screen.getByText('excluir')).toBeDisabled();
  });
});