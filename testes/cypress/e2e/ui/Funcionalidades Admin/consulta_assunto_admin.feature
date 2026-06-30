# language: pt

Funcionalidade: Consulta de Assunto

  Contexto:
    Dado eu acesso o sistema com a visualização "web"
    E realizo login no sistema CDEP com perfil "Admin"    

  Esquema do Cenário: Validar: <caso>
    E acesso a tela Assunto
    Quando crio cadastro de assunto "<tipo>"
    E clico no assunto salvo
    Então o sistema exibe o cadastro de assunto

    Exemplos:
      | tipo    | caso                             |
      | acervo  | Consulta de cadastro com sucesso |
      | acervo  | Nome deve ser preenchido         |





