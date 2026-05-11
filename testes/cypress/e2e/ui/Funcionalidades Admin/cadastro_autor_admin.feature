# language: pt

Funcionalidade: Cadastro de autor

  Contexto:
    Dado eu acesso o sistema com a visualização "web"
    E realizo login no sistema CDEP com perfil "Admin"    

  Esquema do Cenário: Validar: <caso>
    E acesso a tela Autor
    Quando crio cadastro de autor "<tipo>"
    Então o sistema salva o autor

    Exemplos:
      | tipo    | caso                           |
      | acervo  | Autor cadastrado com sucesso |

  Esquema do Cenário: Validar: <caso>
    E acesso a tela Autor
    Quando crio cadastro de autor "<tipo>"
    E tento cadastro o mesmo nome no autor
    Então o sistema não permite salvar o autor duplicado

    Exemplos:
      | tipo    | caso                            |
      | acervo  | Não permitir registro duplicado |

  Esquema do Cenário: Validar: <caso>
    E acesso a tela Autor
    Quando clico em novo cadastro de autor "<tipo>"
    E tento salvar sem nome do autor
    Então o sistema não permite salvar sem título do autor

    Exemplos:
      | tipo    | caso                            |
      | acervo  | Título do autor é obrigatório |


