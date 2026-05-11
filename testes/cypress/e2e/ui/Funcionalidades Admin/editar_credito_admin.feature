# language: pt

Funcionalidade: Edição de Crédito

  Contexto:
    Dado eu acesso o sistema com a visualização "web"
    E realizo login no sistema CDEP com perfil "Admin"    

  Esquema do Cenário: Validar: <caso>
    E acesso a tela Crédito
    Quando crio cadastro de crédito "<tipo>"
    E edito o crédito salvo
    Então o sistema edita o cadastro de crédito com sucesso

    Exemplos:
      | tipo    | caso                        |
      | acervo  | Editar cadastro com sucesso |

  Esquema do Cenário: Validar: <caso>
    E acesso a tela Crédito
    Quando crio cadastro de crédito "<tipo>"
    E edito retirando o nome do crédito
    Então o nome do crédito deve ser obrigatório

    Exemplos:
      | tipo    | caso                      |
      | acervo  | Nome deve ser obrigatório |




