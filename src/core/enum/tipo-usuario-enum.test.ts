import { TipoUsuario, TipoUsuarioDisplay } from './tipo-usuario-enum';

describe('TipoUsuario Enum', () => {
  test('deve ter valor CORESSO igual a 0', () => {
    expect(TipoUsuario.CORESSO).toBe(0);
  });

  test('deve ter valor SERVIDOR_PUBLICO igual a 1', () => {
    expect(TipoUsuario.SERVIDOR_PUBLICO).toBe(1);
  });

  test('deve ter valor ESTUDANTE igual a 2', () => {
    expect(TipoUsuario.ESTUDANTE).toBe(2);
  });

  test('deve ter valor PROFESSOR igual a 3', () => {
    expect(TipoUsuario.PROFESSOR).toBe(3);
  });

  test('deve ter valor POPULACAO_GERAL igual a 4', () => {
    expect(TipoUsuario.POPULACAO_GERAL).toBe(4);
  });

  test('TipoUsuarioDisplay deve ter label para CORESSO', () => {
    expect(TipoUsuarioDisplay[TipoUsuario.CORESSO]).toBe('Servidor SME');
  });

  test('TipoUsuarioDisplay deve ter label para SERVIDOR_PUBLICO', () => {
    expect(TipoUsuarioDisplay[TipoUsuario.SERVIDOR_PUBLICO]).toBe('Servidor público');
  });

  test('TipoUsuarioDisplay deve ter label para ESTUDANTE', () => {
    expect(TipoUsuarioDisplay[TipoUsuario.ESTUDANTE]).toBe('Estudante');
  });

  test('TipoUsuarioDisplay deve ter label para PROFESSOR', () => {
    expect(TipoUsuarioDisplay[TipoUsuario.PROFESSOR]).toBe('Professor');
  });

  test('TipoUsuarioDisplay deve ter label para POPULACAO_GERAL', () => {
    expect(TipoUsuarioDisplay[TipoUsuario.POPULACAO_GERAL]).toBe('População em geral');
  });
});
