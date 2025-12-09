import { LISTA_TIPO_USUARIO } from './lista-tipo-usuario';
import { TipoUsuario } from '../enum/tipo-usuario-enum';

describe('LISTA_TIPO_USUARIO', () => {
  test('deve conter exatamente 4 tipos de usuários', () => {
    expect(LISTA_TIPO_USUARIO).toHaveLength(4);
  });

  test('deve conter Servidor público', () => {
    const servidorPublico = LISTA_TIPO_USUARIO.find(
      (tipo) => tipo.value === TipoUsuario.SERVIDOR_PUBLICO,
    );
    expect(servidorPublico).toBeDefined();
    expect(servidorPublico?.label).toBe('Servidor público');
  });

  test('deve conter Estudante', () => {
    const estudante = LISTA_TIPO_USUARIO.find((tipo) => tipo.value === TipoUsuario.ESTUDANTE);
    expect(estudante).toBeDefined();
    expect(estudante?.label).toBe('Estudante');
  });

  test('deve conter Professor', () => {
    const professor = LISTA_TIPO_USUARIO.find((tipo) => tipo.value === TipoUsuario.PROFESSOR);
    expect(professor).toBeDefined();
    expect(professor?.label).toBe('Professor');
  });

  test('deve conter População em geral', () => {
    const populacao = LISTA_TIPO_USUARIO.find(
      (tipo) => tipo.value === TipoUsuario.POPULACAO_GERAL,
    );
    expect(populacao).toBeDefined();
    expect(populacao?.label).toBe('População em geral');
  });

  test('cada item deve ter propriedades value e label', () => {
    LISTA_TIPO_USUARIO.forEach((tipo) => {
      expect(tipo).toHaveProperty('value');
      expect(tipo).toHaveProperty('label');
    });
  });

  test('todos os values devem ser números', () => {
    LISTA_TIPO_USUARIO.forEach((tipo) => {
      expect(typeof tipo.value).toBe('number');
    });
  });

  test('todos os labels devem ser strings não vazias', () => {
    LISTA_TIPO_USUARIO.forEach((tipo) => {
      expect(typeof tipo.label).toBe('string');
      expect(tipo.label.length).toBeGreaterThan(0);
    });
  });

  test('não deve conter tipo CORESSO', () => {
    const coresso = LISTA_TIPO_USUARIO.find((tipo) => tipo.value === TipoUsuario.CORESSO);
    expect(coresso).toBeUndefined();
  });

  test('todos os values devem ser únicos', () => {
    const values = LISTA_TIPO_USUARIO.map((tipo) => tipo.value);
    const uniqueValues = new Set(values);
    expect(uniqueValues.size).toBe(values.length);
  });
});
