import { render, screen, waitFor } from '~/tests/test-utils';
import { Form } from 'antd';
import InputNumero from './';
import { fireEvent } from '@testing-library/react';

const FormWrapper = ({ children }: { children: React.ReactNode }) => {
  const [form] = Form.useForm();
  return <Form form={form}>{children}</Form>;
};

describe('InputNumero', () => {
  test('renderiza o campo Número', () => {
    render(
      <FormWrapper>
        <InputNumero inputProps={{}} />
      </FormWrapper>
    );
    expect(screen.getByText('Número')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Informe o nº')).toBeInTheDocument();
  });

  test('possui id INPUT_NUMERO', () => {
    render(
      <FormWrapper>
        <InputNumero inputProps={{}} />
      </FormWrapper>
    );
    const input = screen.getByPlaceholderText('Informe o nº');
    expect(input).toHaveAttribute('id', 'INPUT_NUMERO');
  });

  test('limita o tamanho máximo a 20 caracteres', () => {
    render(
      <FormWrapper>
        <InputNumero inputProps={{}} />
      </FormWrapper>
    );
    const input = screen.getByPlaceholderText('Informe o nº');
    expect(input).toHaveAttribute('maxLength', '20');
  });

  test('campo possui atributo aria-required', () => {
    render(
      <FormWrapper>
        <InputNumero inputProps={{}} />
      </FormWrapper>
    );
    const input = screen.getByPlaceholderText('Informe o nº');
    expect(input).toHaveAttribute('aria-required', 'true');
  });

  test('aceita números válidos', async () => {
    const { container } = render(
      <FormWrapper>
        <InputNumero inputProps={{}} />
      </FormWrapper>
    );
    const input = screen.getByPlaceholderText('Informe o nº');

    fireEvent.change(input, { target: { value: '123' } });
    fireEvent.blur(input);

    await waitFor(() => {
      expect(container.querySelector('.ant-form-item-explain-error')).not.toBeInTheDocument();
    });
  });

  test('aceita texto alfanumérico', async () => {
    render(
      <FormWrapper>
        <InputNumero inputProps={{}} />
      </FormWrapper>
    );
    const input = screen.getByPlaceholderText('Informe o nº');

    fireEvent.change(input, { target: { value: '123A' } });
    fireEvent.blur(input);

    await waitFor(() => {
      expect(input).toHaveValue('123A');
    });
  });

  test('aceita propriedades customizadas via inputProps', () => {
    render(
      <FormWrapper>
        <InputNumero inputProps={{ disabled: true }} />
      </FormWrapper>
    );
    const input = screen.getByPlaceholderText('Informe o nº');
    expect(input).toBeDisabled();
  });

  test('aceita propriedades customizadas via formItemProps', () => {
    render(
      <FormWrapper>
        <InputNumero inputProps={{}} formItemProps={{ help: 'Texto de ajuda' }} />
      </FormWrapper>
    );
    expect(screen.getByText('Texto de ajuda')).toBeInTheDocument();
  });

  test('permite texto até o limite máximo', () => {
    render(
      <FormWrapper>
        <InputNumero inputProps={{}} />
      </FormWrapper>
    );
    const input = screen.getByPlaceholderText('Informe o nº');
    const textoLimite = '1234567890123456789'; // 19 caracteres

    fireEvent.change(input, { target: { value: textoLimite } });
    expect(input).toHaveValue(textoLimite);
  });
});
