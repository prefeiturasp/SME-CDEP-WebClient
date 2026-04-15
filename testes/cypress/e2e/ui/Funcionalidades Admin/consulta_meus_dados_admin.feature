# language: pt

Funcionalidade: Consulta de Meus Dados

  Contexto:
    Dado eu acesso o sistema com a visualização "web"
    E realizo login no sistema CDEP com perfil "Admin"
    E acesso o menu Meus Dados

    Esquema do Cenário: Validar campo: <caso>
    Quando acesso o menu Meus Dados
    Então os campos de Meus Dados devem estar preenchidos para "<tipo>"

    Exemplos:
      | tipo               | caso                        |
      | email              | E-mail                      |
      | senha              | Senha                       |
