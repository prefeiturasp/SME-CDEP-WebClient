# language: pt

Funcionalidade: Cadastro de Calendário de visitas

  Contexto:
    Dado eu acesso o sistema com a visualização "web"
    E realizo login no sistema CDEP com perfil "Admin"    

  Esquema do Cenário: Validar: <caso>
    E acesso a tela Calendário
    Quando crio cadastro no calendário "<tipo>"
    Então o sistema salva o registro no calendário

    Exemplos:
      | tipo      | caso                            |
      | suspensão | Registro cadastrado com sucesso |

  Esquema do Cenário: Validar: <caso>
    E acesso a tela Calendário
    Quando tento cadastrar o mesmo dia no calendário "<tipo>"
    Então o sistema não permite salvar o calendário duplicado

    Exemplos:
      | tipo      | caso                            |
      | suspensão | Não permitir registro duplicado |

  Esquema do Cenário: Validar: <caso>
    E acesso a tela Calendário
    Quando tento salvar sem justificativa no calendário "<tipo>"
    Então o sistema não permite salvar sem preencher no calendário

    Exemplos:
      | tipo      | caso                        |
      | suspensão | Justificativa é obrigatória |
  
  Esquema do Cenário: Validar: <caso>
    E acesso a tela Calendário
    Quando cancelo o cadastro no calendário "<tipo>"
    Então o sistema retorna todos os dias no calendário

    Exemplos:
      | tipo      | caso                       |
      | suspensão | Cancelamento do cadastrado |
  
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

