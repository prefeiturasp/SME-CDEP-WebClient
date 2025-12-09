import { render, screen } from '~/tests/test-utils';
import { Form } from 'antd';
import InputDatePicker from './';

const FormWrapper = ({ children }: { children: React.ReactNode }) => {
  const [form] = Form.useForm();
  return <Form form={form}>{children}</Form>;
};

describe('InputDatePicker', () => {
  test('renderiza o campo de data', () => {
    render(
      <FormWrapper>
        <InputDatePicker dateProps={{}} />
      </FormWrapper>
    );
    expect(screen.getByText('Data')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Selecione uma data')).toBeInTheDocument();
  });

  test('possui id INPUT_DATE', () => {
    render(
      <FormWrapper>
        <InputDatePicker dateProps={{}} />
      </FormWrapper>
    );
    const input = screen.getByPlaceholderText('Selecione uma data');
    expect(input).toHaveAttribute('id', 'INPUT_DATE');
  });

  test('utiliza formato DD/MM/YYYY', () => {
    const { container } = render(
      <FormWrapper>
        <InputDatePicker dateProps={{}} />
      </FormWrapper>
    );
    const datePicker = container.querySelector('.ant-picker');
    expect(datePicker).toBeInTheDocument();
  });

  test('aceita propriedades customizadas via dateProps', () => {
    render(
      <FormWrapper>
        <InputDatePicker dateProps={{ disabled: true }} />
      </FormWrapper>
    );
    const input = screen.getByPlaceholderText('Selecione uma data');
    expect(input).toBeDisabled();
  });

  test('aceita propriedades customizadas via formItemProps', () => {
    render(
      <FormWrapper>
        <InputDatePicker dateProps={{}} formItemProps={{ help: 'Texto de ajuda' }} />
      </FormWrapper>
    );
    expect(screen.getByText('Texto de ajuda')).toBeInTheDocument();
  });

  test('aceita label customizado via formItemProps', () => {
    render(
      <FormWrapper>
        <InputDatePicker dateProps={{}} formItemProps={{ label: 'Data Personalizada' }} />
      </FormWrapper>
    );
    expect(screen.getByText('Data Personalizada')).toBeInTheDocument();
  });

  test('aceita name customizado via formItemProps', () => {
    render(
      <FormWrapper>
        <InputDatePicker dateProps={{}} formItemProps={{ name: 'dataCustomizada' }} />
      </FormWrapper>
    );
    const input = screen.getByPlaceholderText('Selecione uma data');
    expect(input).toBeInTheDocument();
  });

  test('renderiza com locale pt_BR', () => {
    const { container } = render(
      <FormWrapper>
        <InputDatePicker dateProps={{}} />
      </FormWrapper>
    );
    const datePicker = container.querySelector('.ant-picker');
    expect(datePicker).toBeInTheDocument();
  });
});
