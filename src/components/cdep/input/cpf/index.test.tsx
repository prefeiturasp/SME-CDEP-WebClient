import { render, screen, waitFor } from '~/tests/test-utils';
import { Form } from 'antd';
import InputCPF from './';
import { fireEvent } from '@testing-library/react';

const FormWrapper = ({ children }: { children: React.ReactNode }) => {
  const [form] = Form.useForm();
  return <Form form={form}>{children}</Form>;
};

describe('InputCPF', () => {
  test('renderiza o campo CPF', () => {
    render(
      <FormWrapper>
        <InputCPF inputProps={{}} />
      </FormWrapper>
    );
    expect(screen.getByLabelText('CPF')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Informe o CPF')).toBeInTheDocument();
  });

  test('aplica máscara de CPF ao digitar', async () => {
    render(
      <FormWrapper>
        <InputCPF inputProps={{}} />
      </FormWrapper>
    );
    const input = screen.getByPlaceholderText('Informe o CPF');
    fireEvent.change(input, { target: { value: '12345678901' } });

    await waitFor(() => {
      expect(input).toHaveValue('123.456.789-01');
    });
  });

  test('remove caracteres não numéricos', async () => {
    render(
      <FormWrapper>
        <InputCPF inputProps={{}} />
      </FormWrapper>
    );
    const input = screen.getByPlaceholderText('Informe o CPF');
    fireEvent.change(input, { target: { value: 'abc123def456ghi789' } });

    await waitFor(() => {
      expect(input).toHaveValue('123.456.789');
    });
  });

  test('valida CPF com menos de 11 dígitos', async () => {
    const { container } = render(
      <FormWrapper>
        <InputCPF inputProps={{}} />
      </FormWrapper>
    );
    const input = screen.getByPlaceholderText('Informe o CPF');

    fireEvent.change(input, { target: { value: '12345' } });
    fireEvent.blur(input);

    await waitFor(() => {
      expect(container.querySelector('.ant-form-item-explain-error')).toBeInTheDocument();
    });
  });

  test('aceita CPF válido com 11 dígitos', async () => {
    const { container } = render(
      <FormWrapper>
        <InputCPF inputProps={{}} />
      </FormWrapper>
    );
    const input = screen.getByPlaceholderText('Informe o CPF');

    fireEvent.change(input, { target: { value: '12345678901' } });
    fireEvent.blur(input);

    await waitFor(() => {
      expect(container.querySelector('.ant-form-item-explain-error')).not.toBeInTheDocument();
    });
  });

  test('aceita propriedades customizadas via inputProps', () => {
    render(
      <FormWrapper>
        <InputCPF inputProps={{ disabled: true }} />
      </FormWrapper>
    );
    const input = screen.getByPlaceholderText('Informe o CPF');
    expect(input).toBeDisabled();
  });

  test('aceita propriedades customizadas via formItemProps', () => {
    render(
      <FormWrapper>
        <InputCPF inputProps={{}} formItemProps={{ help: 'Texto de ajuda' }} />
      </FormWrapper>
    );
    expect(screen.getByText('Texto de ajuda')).toBeInTheDocument();
  });

  test('não ultrapassa 14 caracteres (formato XXX.XXX.XXX-XX)', async () => {
    render(
      <FormWrapper>
        <InputCPF inputProps={{}} />
      </FormWrapper>
    );
    const input = screen.getByPlaceholderText('Informe o CPF');
    fireEvent.change(input, { target: { value: '123456789012345' } });

    await waitFor(() => {
      expect(input.getAttribute('value')?.length).toBeLessThanOrEqual(14);
    });
  });
});
