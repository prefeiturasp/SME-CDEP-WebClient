# language: pt

Funcionalidade: Consulta de autor

  Contexto:
    Dado eu acesso o sistema com a visualização "web"
    E realizo login no sistema CDEP com perfil "Admin"    

  Esquema do Cenário: Validar: <caso>
    E acesso a tela Autor
    Quando crio cadastro de autor "<tipo>"
    E clico no autor salvo
    Então o sistema exibe o cadastro de autor

    Exemplos:
      | tipo    | caso                             |
      | acervo  | Consulta de cadastro com sucesso |
      | acervo  | Nome deve ser preenchido         |





