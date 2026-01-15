import { render, screen } from '~/tests/test-utils';
import Alert, { TypeAlertEnum } from './';

describe('Alert', () => {
  test('renderiza alerta com tipo info', () => {
    render(<Alert message="Mensagem informativa" type={TypeAlertEnum.Info} />);
    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveClass('ant-alert-info');
  });

  test('renderiza alerta com tipo success', () => {
    render(<Alert message="Operação realizada com sucesso" type={TypeAlertEnum.Success} />);
    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveClass('ant-alert-success');
  });

  test('renderiza alerta com tipo warning', () => {
    render(<Alert message="Atenção necessária" type={TypeAlertEnum.Warning} />);
    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveClass('ant-alert-warning');
  });

  test('renderiza alerta com tipo error', () => {
    render(<Alert message="Erro ocorrido" type={TypeAlertEnum.Error} />);
    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveClass('ant-alert-error');
  });

  test('renderiza mensagem do alerta', () => {
    const mensagem = 'Esta é uma mensagem de teste';
    render(<Alert message={mensagem} type={TypeAlertEnum.Info} />);
    expect(screen.getByText(mensagem)).toBeInTheDocument();
  });

  test('renderiza com ícone por padrão', () => {
    render(<Alert message="Teste" type={TypeAlertEnum.Info} />);
    const alert = screen.getByRole('alert');
    const icon = alert.querySelector('.ant-alert-icon');
    expect(icon).toBeInTheDocument();
  });

  test('renderiza descrição quando fornecida', () => {
    const descricao = 'Descrição detalhada do alerta';
    render(
      <Alert
        message="Título"
        description={descricao}
        type={TypeAlertEnum.Info}
      />,
    );
    expect(screen.getByText(descricao)).toBeInTheDocument();
  });

  test('renderiza o divider-bottom', () => {
    const { container } = render(
      <Alert message="Teste" type={TypeAlertEnum.Success} />,
    );
    const divider = container.querySelector('.divider-bottom');
    expect(divider).toBeInTheDocument();
  });

  test('aceita propriedades adicionais do AlertProps', () => {
    render(
      <Alert
        message="Teste"
        type={TypeAlertEnum.Info}
        closable
      />,
    );
    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    const closeButton = alert.querySelector('.ant-alert-close-icon');
    expect(closeButton).toBeInTheDocument();
  });
});
