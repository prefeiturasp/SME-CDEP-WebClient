import { render, screen } from '~/tests/test-utils';
import AlertaSomenteConsulta from './';

describe('AlertaSomenteConsulta', () => {
  test('renderiza alerta quando somenteConsulta é true', () => {
    render(<AlertaSomenteConsulta somenteConsulta={true} />);
    expect(screen.getByText('Atenção')).toBeInTheDocument();
    expect(screen.getByText('Você tem apenas permissão de consulta nesta tela.')).toBeInTheDocument();
  });

  test('não renderiza alerta quando somenteConsulta é false', () => {
    render(<AlertaSomenteConsulta somenteConsulta={false} />);
    expect(screen.queryByText('Atenção')).not.toBeInTheDocument();
    expect(screen.queryByText('Você tem apenas permissão de consulta nesta tela.')).not.toBeInTheDocument();
  });

  test('não renderiza alerta por padrão quando prop não é fornecida', () => {
    render(<AlertaSomenteConsulta />);
    expect(screen.queryByText('Atenção')).not.toBeInTheDocument();
  });

  test('renderiza alerta do tipo warning', () => {
    const { container } = render(<AlertaSomenteConsulta somenteConsulta={true} />);
    const alert = container.querySelector('.ant-alert-warning');
    expect(alert).toBeInTheDocument();
  });
});
