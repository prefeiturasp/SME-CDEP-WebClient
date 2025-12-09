import { render, screen } from '~/tests/test-utils';
import Auditoria from './';
import { AuditoriaDTO } from '~/core/dto/auditoria-dto';

describe('Auditoria', () => {
  const dadosAuditoria: AuditoriaDTO = {
    criadoPor: 'João Silva',
    criadoLogin: '1234567',
    criadoEm: '2024-01-15T10:30:00',
    alteradoPor: 'Maria Santos',
    alteradoLogin: '7654321',
    alteradoEm: '2024-01-16T14:45:00',
  };

  test('deve renderizar informações de criação', () => {
    render(<Auditoria dados={dadosAuditoria} />);
    expect(screen.getByText(/INSERIDO por João Silva/)).toBeInTheDocument();
    expect(screen.getByText(/\(1234567\)/)).toBeInTheDocument();
  });

  test('deve renderizar informações de alteração', () => {
    render(<Auditoria dados={dadosAuditoria} />);
    expect(screen.getByText(/ALTERADO por Maria Santos/)).toBeInTheDocument();
    expect(screen.getByText(/\(7654321\)/)).toBeInTheDocument();
  });

  test('deve renderizar data e hora de criação formatada', () => {
    render(<Auditoria dados={dadosAuditoria} />);
    expect(screen.getByText(/15\/01\/2024 às 10:30/)).toBeInTheDocument();
  });

  test('deve renderizar data e hora de alteração formatada', () => {
    render(<Auditoria dados={dadosAuditoria} />);
    expect(screen.getByText(/16\/01\/2024 às 14:45/)).toBeInTheDocument();
  });

  test('não deve renderizar nada quando dados são undefined', () => {
    const { container } = render(<Auditoria dados={undefined} />);
    expect(container.textContent).toBe('');
  });

  test('não deve renderizar nada quando criadoPor está vazio', () => {
    const dadosSemCriador: AuditoriaDTO = {
      criadoPor: '',
      criadoLogin: '',
      criadoEm: '',
      alteradoPor: '',
      alteradoLogin: '',
      alteradoEm: '',
    };
    const { container } = render(<Auditoria dados={dadosSemCriador} />);
    expect(container.textContent).toBe('');
  });

  test('deve renderizar apenas informações de criação quando não há alteração', () => {
    const dadosApenasInserir: AuditoriaDTO = {
      criadoPor: 'João Silva',
      criadoLogin: '1234567',
      criadoEm: '2024-01-15T10:30:00',
      alteradoPor: '',
      alteradoLogin: '',
      alteradoEm: '',
    };
    render(<Auditoria dados={dadosApenasInserir} />);
    expect(screen.getByText(/INSERIDO por João Silva/)).toBeInTheDocument();
    expect(screen.queryByText(/ALTERADO/)).not.toBeInTheDocument();
  });

  test('deve usar Typography.Text do antd', () => {
    const { container } = render(<Auditoria dados={dadosAuditoria} />);
    const textElements = container.querySelectorAll('.ant-typography');
    expect(textElements.length).toBeGreaterThan(0);
  });

  test('deve aplicar estilo de fonte pequena', () => {
    const { container } = render(<Auditoria dados={dadosAuditoria} />);
    const textElements = container.querySelectorAll('[style*="font-size: 9"]');
    expect(textElements.length).toBeGreaterThan(0);
  });

  test('deve renderizar dentro de Row e Col do antd', () => {
    const { container } = render(<Auditoria dados={dadosAuditoria} />);
    expect(container.querySelector('.ant-row')).toBeInTheDocument();
    expect(container.querySelector('.ant-col')).toBeInTheDocument();
  });
});
