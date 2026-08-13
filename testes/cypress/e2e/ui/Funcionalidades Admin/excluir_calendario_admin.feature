# language: pt

Funcionalidade: Cadastro de Calendário de visitas

  Contexto:
    Dado eu acesso o sistema com a visualização "web"
    E realizo login no sistema CDEP com perfil "Admin"    

  Esquema do Cenário: Validar: <caso>
    E acesso a tela Calendário
    Quando cancelo a exclusão do cadastro no calendário "<tipo>"
    Então o sistema retorna para o dia de registro do calendário

    Exemplos:
      | tipo      | caso                     |
      | suspensão | Cancelamento da exclusão |

  Esquema do Cenário: Validar: <caso>
    E acesso a tela Calendário
    Quando excluo cadastro no calendário "<tipo>"
    Então o sistema retira o registro no calendário

    Exemplos:
      | tipo      | caso                          |
      | suspensão | Registro excluído com sucesso |

