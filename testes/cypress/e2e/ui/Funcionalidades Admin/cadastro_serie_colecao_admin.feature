# language: pt

Funcionalidade: Cadastro de Série/Coleção

  Contexto:
    Dado eu acesso o sistema com a visualização "web"
    E realizo login no sistema CDEP com perfil "Admin"    

  Esquema do Cenário: Validar: <caso>
    E acesso a tela Série e Coleção
    Quando crio cadastro de série "<tipo>"
    Então o sistema salva a série

    Exemplos:
      | tipo    | caso                         |
      | acervo  | Cadastrado com sucesso |

  Esquema do Cenário: Validar: <caso>
    E acesso a tela Série e Coleção
    Quando crio cadastro de série "<tipo>"
    E tento cadastro o mesmo nome na série    
    Então o sistema não permite salvar a série duplicada

    Exemplos:
      | tipo    | caso                            |
      | acervo  | Não permitir registro duplicado |

  Esquema do Cenário: Validar: <caso>
    E acesso a tela Série e Coleção
    Quando clico em novo cadastro de série "<tipo>"
    E tento salvar sem nome da série
    Então o sistema não permite salvar sem título da série

    Exemplos:
      | tipo    | caso                 |
      | acervo  | Título é obrigatório |


