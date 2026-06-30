# language: pt

Funcionalidade: Consulta de Crédito

  Contexto:
    Dado eu acesso o sistema com a visualização "web"
    E realizo login no sistema CDEP com perfil "Admin"    

  Esquema do Cenário: Validar: <caso>
    E acesso a tela Crédito
    Quando crio cadastro de crédito "<tipo>"
    E clico no crédito salvo
    Então o sistema exibe o cadastro de crédito

    Exemplos:
      | tipo    | caso                             |
      | acervo  | Consulta de cadastro com sucesso |
      | acervo  | Nome deve ser preenchido         |





