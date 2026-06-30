# language: pt

Funcionalidade: Consulta de Editora

  Contexto:
    Dado eu acesso o sistema com a visualização "web"
    E realizo login no sistema CDEP com perfil "Admin"    

  Esquema do Cenário: Validar: <caso>
    E acesso a tela Editora
    Quando crio cadastro de editora "<tipo>"
    E clico na editora salva
    Então o sistema exibe o cadastro de editora

    Exemplos:
      | tipo    | caso                             |
      | acervo  | Consulta de cadastro com sucesso |
      | acervo  | Nome deve ser preenchido         |





