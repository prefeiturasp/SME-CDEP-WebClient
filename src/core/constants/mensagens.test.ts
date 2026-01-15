import * as mensagens from './mensagens';

describe('Mensagens do Sistema', () => {
  test('deve ter mensagem de erro de login ou senha incorretos', () => {
    expect(mensagens.ERRO_LOGIN_SENHA_INCORRETOS).toBe('Login ou senha incorretos');
  });

  test('deve ter mensagem de erro ao informar usuário e senha', () => {
    expect(mensagens.ERRO_INFORMAR_USUARIO_SENHA).toBe(
      'Você precisa informar um usuário e senha para acessar o sistema',
    );
  });

  test('deve ter mensagem de erro de login', () => {
    expect(mensagens.ERRO_LOGIN).toBe('Erro ao tentar autenticar no servidor');
  });

  test('deve ter mensagem de cancelar alterações', () => {
    expect(mensagens.DESEJA_CANCELAR_ALTERACOES).toContain('cancelar as alterações');
  });

  test('deve ter mensagem de exclusão de acervo', () => {
    expect(mensagens.DESEJA_EXCLUIR_ACERVO).toBe('Deseja realmente excluir o acervo?');
  });

  test('deve ter mensagem de acervo excluído com sucesso', () => {
    expect(mensagens.ACERVO_EXCLUIDO_SUCESSO).toBe('Acervo excluído com sucesso');
  });

  test('deve ter mensagem de erro de data de visita', () => {
    expect(mensagens.ERRO_DATA_VISITA).toContain('data da visita');
    expect(mensagens.ERRO_DATA_VISITA).toContain('posterior');
  });

  test('deve ter mensagem de erro de data de empréstimo', () => {
    expect(mensagens.ERRO_DATA_EMPRESTIMO).toContain('data do empréstimo');
    expect(mensagens.ERRO_DATA_EMPRESTIMO).toContain('anterior');
  });

  test('deve ter mensagem de erro de data de devolução', () => {
    expect(mensagens.ERRO_DATA_DEVOLUCAO).toContain('data da devolução');
    expect(mensagens.ERRO_DATA_DEVOLUCAO).toContain('anterior');
  });

  test('todas as mensagens devem ser strings não vazias', () => {
    Object.values(mensagens).forEach((mensagem) => {
      expect(typeof mensagem).toBe('string');
      expect(mensagem.length).toBeGreaterThan(0);
    });
  });
});
