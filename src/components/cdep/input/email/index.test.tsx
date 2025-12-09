import { render, screen, waitFor } from '~/tests/test-utils';
import { Form } from 'antd';
import InputEmail from './';
import { fireEvent } from '@testing-library/react';

const FormWrapper = ({ children }: { children: React.ReactNode }) => {
  const [form] = Form.useForm();
  return <Form form={form}>{children}</Form>;
};

describe('InputEmail', () => {
  test('renderiza o campo de e-mail', () => {
    render(
      <FormWrapper>
        <InputEmail inputProps={{}} />
      </FormWrapper>
    );
    expect(screen.getByPlaceholderText('Informe o e-mail')).toBeInTheDocument();
    expect(screen.getByText('E-mail')).toBeInTheDocument();
  });

  test('valida formato de e-mail válido', async () => {
    const { container } = render(
      <FormWrapper>
        <InputEmail inputProps={{}} />
      </FormWrapper>
    );
    const input = screen.getByPlaceholderText('Informe o e-mail');

    fireEvent.change(input, { target: { value: 'teste@exemplo.com' } });
    fireEvent.blur(input);

    await waitFor(() => {
      expect(container.querySelector('.ant-form-item-explain-error')).not.toBeInTheDocument();
    });
  });

  test('invalida e-mail sem @', async () => {
    render(
      <FormWrapper>
        <InputEmail inputProps={{}} />
      </FormWrapper>
    );
    const input = screen.getByPlaceholderText('Informe o e-mail');

    fireEvent.change(input, { target: { value: 'testeexemplo.com' } });
    fireEvent.blur(input);

    await waitFor(() => {
      expect(screen.getByText('Não é um e-mail válido')).toBeInTheDocument();
    });
  });

  test('invalida e-mail sem domínio', async () => {
    render(
      <FormWrapper>
        <InputEmail inputProps={{}} />
      </FormWrapper>
    );
    const input = screen.getByPlaceholderText('Informe o e-mail');

    fireEvent.change(input, { target: { value: 'teste@' } });
    fireEvent.blur(input);

    await waitFor(() => {
      expect(screen.getByText('Não é um e-mail válido')).toBeInTheDocument();
    });
  });

  test('limita o tamanho máximo do campo a 100 caracteres', () => {
    render(
      <FormWrapper>
        <InputEmail inputProps={{}} />
      </FormWrapper>
    );
    const input = screen.getByPlaceholderText('Informe o e-mail');
    expect(input).toHaveAttribute('maxLength', '100');
  });

  test('possui autocomplete desligado', () => {
    render(
      <FormWrapper>
        <InputEmail inputProps={{}} />
      </FormWrapper>
    );
    const input = screen.getByPlaceholderText('Informe o e-mail');
    expect(input).toHaveAttribute('autocomplete', 'off');
  });

  test('possui id INPUT_EMAIL', () => {
    render(
      <FormWrapper>
        <InputEmail inputProps={{}} />
      </FormWrapper>
    );
    const input = screen.getByPlaceholderText('Informe o e-mail');
    expect(input).toHaveAttribute('id', 'INPUT_EMAIL');
  });

  test('aceita propriedades customizadas via inputProps', () => {
    render(
      <FormWrapper>
        <InputEmail inputProps={{ disabled: true }} />
      </FormWrapper>
    );
    const input = screen.getByPlaceholderText('Informe o e-mail');
    expect(input).toBeDisabled();
  });

  test('valida confirmação de e-mail quando configurado', async () => {
    render(
      <FormWrapper>
        <InputEmail inputProps={{}} formItemProps={{ name: 'email' }} />
        <InputEmail
          inputProps={{}}
          formItemProps={{ name: 'confirmarEmail', label: 'Confirmar E-mail' }}
          confirmarEmail={{ fieldName: 'email' }}
        />
      </FormWrapper>
    );

    const allEmailInputs = screen.getAllByPlaceholderText('Informe o e-mail');
    const emailInput = allEmailInputs[0];
    const confirmarEmailInput = allEmailInputs[1];

    fireEvent.change(emailInput, { target: { value: 'teste@exemplo.com' } });
    fireEvent.change(confirmarEmailInput, { target: { value: 'diferente@exemplo.com' } });
    fireEvent.blur(confirmarEmailInput);

    await waitFor(() => {
      expect(screen.getByText('E-mails não correspondem')).toBeInTheDocument();
    });
  });
});
