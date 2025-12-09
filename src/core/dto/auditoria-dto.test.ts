import { AuditoriaDTO } from './auditoria-dto';

describe('AuditoriaDTO', () => {
  test('deve aceitar objeto com todas as propriedades', () => {
    const auditoria: AuditoriaDTO = {
      criadoPor: 'João Silva',
      criadoLogin: '1234567',
      criadoEm: '2024-01-15T10:30:00',
      alteradoPor: 'Maria Santos',
      alteradoLogin: '7654321',
      alteradoEm: '2024-01-16T14:45:00',
    };

    expect(auditoria.criadoPor).toBe('João Silva');
    expect(auditoria.criadoLogin).toBe('1234567');
    expect(auditoria.criadoEm).toBe('2024-01-15T10:30:00');
    expect(auditoria.alteradoPor).toBe('Maria Santos');
    expect(auditoria.alteradoLogin).toBe('7654321');
    expect(auditoria.alteradoEm).toBe('2024-01-16T14:45:00');
  });

  test('deve aceitar strings vazias', () => {
    const auditoria: AuditoriaDTO = {
      criadoPor: '',
      criadoLogin: '',
      criadoEm: '',
      alteradoPor: '',
      alteradoLogin: '',
      alteradoEm: '',
    };

    expect(auditoria.criadoPor).toBe('');
    expect(auditoria.alteradoPor).toBe('');
  });

  test('deve ter todas as propriedades obrigatórias', () => {
    const auditoria: AuditoriaDTO = {
      criadoPor: 'Usuário',
      criadoLogin: 'login',
      criadoEm: '2024-01-01',
      alteradoPor: 'Outro Usuário',
      alteradoLogin: 'outro',
      alteradoEm: '2024-01-02',
    };

    expect(auditoria).toHaveProperty('criadoPor');
    expect(auditoria).toHaveProperty('criadoLogin');
    expect(auditoria).toHaveProperty('criadoEm');
    expect(auditoria).toHaveProperty('alteradoPor');
    expect(auditoria).toHaveProperty('alteradoLogin');
    expect(auditoria).toHaveProperty('alteradoEm');
  });

  test('deve aceitar dados de criação sem alteração', () => {
    const auditoria: AuditoriaDTO = {
      criadoPor: 'João Silva',
      criadoLogin: '1234567',
      criadoEm: '2024-01-15T10:30:00',
      alteradoPor: '',
      alteradoLogin: '',
      alteradoEm: '',
    };

    expect(auditoria.criadoPor).toBeTruthy();
    expect(auditoria.alteradoPor).toBeFalsy();
  });

  test('criadoPor deve ser string', () => {
    const auditoria: AuditoriaDTO = {
      criadoPor: 'Teste',
      criadoLogin: 'login',
      criadoEm: 'data',
      alteradoPor: 'alterado',
      alteradoLogin: 'login2',
      alteradoEm: 'data2',
    };

    expect(typeof auditoria.criadoPor).toBe('string');
  });

  test('criadoLogin deve ser string', () => {
    const auditoria: AuditoriaDTO = {
      criadoPor: 'Teste',
      criadoLogin: '123456',
      criadoEm: 'data',
      alteradoPor: 'alterado',
      alteradoLogin: 'login2',
      alteradoEm: 'data2',
    };

    expect(typeof auditoria.criadoLogin).toBe('string');
  });

  test('deve aceitar datas em formato ISO', () => {
    const auditoria: AuditoriaDTO = {
      criadoPor: 'User',
      criadoLogin: 'user123',
      criadoEm: '2024-01-15T10:30:00.000Z',
      alteradoPor: 'Admin',
      alteradoLogin: 'admin',
      alteradoEm: '2024-01-16T14:45:00.000Z',
    };

    expect(auditoria.criadoEm).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    expect(auditoria.alteradoEm).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
  });

  test('alteradoPor deve ser string', () => {
    const auditoria: AuditoriaDTO = {
      criadoPor: 'Criador',
      criadoLogin: 'criador123',
      criadoEm: '2024-01-01',
      alteradoPor: 'Modificador',
      alteradoLogin: 'mod123',
      alteradoEm: '2024-01-02',
    };

    expect(typeof auditoria.alteradoPor).toBe('string');
  });

  test('alteradoLogin deve ser string', () => {
    const auditoria: AuditoriaDTO = {
      criadoPor: 'Criador',
      criadoLogin: 'criador123',
      criadoEm: '2024-01-01',
      alteradoPor: 'Modificador',
      alteradoLogin: '987654',
      alteradoEm: '2024-01-02',
    };

    expect(typeof auditoria.alteradoLogin).toBe('string');
  });

  test('deve aceitar nomes com caracteres especiais', () => {
    const auditoria: AuditoriaDTO = {
      criadoPor: 'José da Silva',
      criadoLogin: 'jose.silva',
      criadoEm: '2024-01-01',
      alteradoPor: 'Maria José',
      alteradoLogin: 'maria.jose',
      alteradoEm: '2024-01-02',
    };

    expect(auditoria.criadoPor).toBe('José da Silva');
    expect(auditoria.alteradoPor).toBe('Maria José');
  });
});
