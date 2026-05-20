# language: pt

Funcionalidade: Cadastro de Crédito

  Contexto:
    Dado eu acesso o sistema com a visualização "web"
    E realizo login no sistema CDEP com perfil "Admin"    

  Esquema do Cenário: Validar: <caso>
    E acesso a tela Crédito
    Quando crio cadastro de crédito "<tipo>"
    Então o sistema salva o crédito

    Exemplos:
      | tipo    | caso                           |
      | acervo  | Crédito cadastrado com sucesso |

  Esquema do Cenário: Validar: <caso>
    E acesso a tela Crédito
    Quando crio cadastro de crédito "<tipo>"
    E tento cadastro o mesmo nome no crédito
    Então o sistema não permite salvar o crédito duplicado

    Exemplos:
      | tipo    | caso                            |
      | acervo  | Não permitir registro duplicado |

  Esquema do Cenário: Validar: <caso>
    E acesso a tela Crédito
    Quando clico em novo cadastro de crédito "<tipo>"
    E tento salvar sem nome do crédito
    Então o sistema não permite salvar sem título do crédito

    Exemplos:
      | tipo    | caso                            |
      | acervo  | Título do crédito é obrigatório |


