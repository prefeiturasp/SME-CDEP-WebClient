# language: pt

Funcionalidade: Cadastro de Editora

  Contexto:
    Dado eu acesso o sistema com a visualização "web"
    E realizo login no sistema CDEP com perfil "Admin"    

  Esquema do Cenário: Validar: <caso>
    E acesso a tela Editora
    Quando crio cadastro de editora "<tipo>"
    Então o sistema salva a editora

    Exemplos:
      | tipo    | caso                           |
      | acervo  | Editora cadastrada com sucesso |

  Esquema do Cenário: Validar: <caso>
    E acesso a tela Editora
    Quando crio cadastro de editora "<tipo>"
    E tento cadastrar o mesmo nome da editora
    Então o sistema não permite salvar a editora duplicada

    Exemplos:
      | tipo    | caso                            |
      | acervo  | Não permitir registro duplicado |

  Esquema do Cenário: Validar: <caso>
    E acesso a tela Editora
    Quando clico em novo cadastro de editora "<tipo>"
    E tento salvar sem nome da editora
    Então o sistema não permite salvar sem título da editora

    Exemplos:
      | tipo    | caso                            |
      | acervo  | Título da editora é obrigatório |


