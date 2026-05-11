# language: pt

Funcionalidade: Exclusão de Crédito

  Contexto:
    Dado eu acesso o sistema com a visualização "web"
    E realizo login no sistema CDEP com perfil "Admin"    

  Esquema do Cenário: Validar: <caso>
    E acesso a tela Crédito
    Quando crio cadastro de crédito "<tipo>"
    E clico para excluir o crédito salvo
    Então o sistema exclui o crédito

    Exemplos:
      | tipo    | caso                         |
      | acervo  | Excluir cadastro com sucesso |

  Esquema do Cenário: Validar: <caso>
    E acesso a tela Crédito
    Quando crio cadastro de crédito "<tipo>"
    E clico para excluir o crédito salvo
    Então o sistema cancela exclusão do crédito

    Exemplos:
      | tipo    | caso                         |
      | acervo  | Cancelar exclusão do crédito |




