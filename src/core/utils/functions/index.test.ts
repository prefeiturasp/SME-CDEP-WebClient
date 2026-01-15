import {
  removerTudoQueNaoEhDigito,
  formatarDuasCasasDecimais,
  formatarHora,
  formatterCPFMask,
  maskTelefone,
  formatarDataParaDDMMYYYY,
  formatarDataHoraAuditoria,
} from './index';
import { dayjs } from '~/core/date/dayjs';

describe('Funções Utilitárias', () => {
  describe('removerTudoQueNaoEhDigito', () => {
    test('remove caracteres não numéricos de uma string', () => {
      expect(removerTudoQueNaoEhDigito('123abc456')).toBe('123456');
    });

    test('mantém apenas dígitos', () => {
      expect(removerTudoQueNaoEhDigito('R$ 1.234,56')).toBe('123456');
    });

    test('retorna string vazia quando não há dígitos', () => {
      expect(removerTudoQueNaoEhDigito('abc')).toBe('');
    });

    test('funciona com números', () => {
      expect(removerTudoQueNaoEhDigito(12345)).toBe('12345');
    });
  });

  describe('formatarDuasCasasDecimais', () => {
    test('formata número com duas casas decimais', () => {
      expect(formatarDuasCasasDecimais('12345')).toBe('123,45');
    });

    test('formata valor com pontuação', () => {
      expect(formatarDuasCasasDecimais('1.234,56')).toBe('1234,56');
    });

    test('funciona com números inteiros', () => {
      expect(formatarDuasCasasDecimais(12345)).toBe('123,45');
    });

    test('retorna formato correto para valores com menos de 3 dígitos', () => {
      expect(formatarDuasCasasDecimais('12')).toBe('12');
    });
  });

  describe('formatarHora', () => {
    test('formata hora corretamente com 4 dígitos', () => {
      expect(formatarHora('1430')).toBe('14:30');
    });

    test('formata hora com caracteres especiais', () => {
      expect(formatarHora('14:30')).toBe('14:30');
    });

    test('retorna 00:00 para horas inválidas (acima de 23)', () => {
      expect(formatarHora('2530')).toBe('00:00');
    });

    test('retorna 00:00 para minutos inválidos (acima de 59)', () => {
      expect(formatarHora('1465')).toBe('00:00');
    });

    test('formata hora com menos de 4 dígitos', () => {
      expect(formatarHora('930')).toBe('930');
    });

    test('aceita hora válida no limite', () => {
      expect(formatarHora('2359')).toBe('23:59');
    });
  });

  describe('formatterCPFMask', () => {
    test('formata CPF corretamente', () => {
      expect(formatterCPFMask('12345678901')).toBe('123.456.789-01');
    });

    test('formata CPF já com pontuação', () => {
      expect(formatterCPFMask('123.456.789-01')).toBe('123.456.789-01');
    });

    test('formata números', () => {
      expect(formatterCPFMask(12345678901)).toBe('123.456.789-01');
    });

    test('limita formatação aos primeiros 11 dígitos', () => {
      expect(formatterCPFMask('123456789012345')).toBe('123.456.789-01');
    });
  });

  describe('maskTelefone', () => {
    test('formata telefone com 11 dígitos (celular)', () => {
      expect(maskTelefone('11987654321')).toBe('(11) 98765-4321');
    });

    test('formata telefone com 10 dígitos (fixo)', () => {
      expect(maskTelefone('1133334444')).toBe('(11) 3333-4444');
    });

    test('formata número de telefone', () => {
      expect(maskTelefone(11987654321)).toBe('(11) 98765-4321');
    });

    test('funciona com string vazia', () => {
      expect(maskTelefone('')).toBe('');
    });
  });

  describe('formatarDataParaDDMMYYYY', () => {
    test('formata data no formato DD/MM/YYYY', () => {
      const data = '2024-01-15';
      expect(formatarDataParaDDMMYYYY(data)).toBe('15/01/2024');
    });

    test('retorna undefined para data nula', () => {
      expect(formatarDataParaDDMMYYYY(null)).toBeUndefined();
    });

    test('retorna undefined para data indefinida', () => {
      expect(formatarDataParaDDMMYYYY(undefined)).toBeUndefined();
    });

    test('formata objeto Dayjs', () => {
      const data = dayjs('2024-01-15');
      expect(formatarDataParaDDMMYYYY(data)).toBe('15/01/2024');
    });
  });

  describe('formatarDataHoraAuditoria', () => {
    test('formata data e hora para auditoria', () => {
      const data = '2024-01-15T14:30:00';
      const resultado = formatarDataHoraAuditoria(data);
      expect(resultado).toContain('15/01/2024');
      expect(resultado).toContain('às');
      expect(resultado).toContain('14:30');
    });

    test('mantém formato consistente', () => {
      const data = '2024-12-31T23:59:59';
      const resultado = formatarDataHoraAuditoria(data);
      expect(resultado).toMatch(/\d{2}\/\d{2}\/\d{4} às \d{2}:\d{2}/);
    });
  });
});
