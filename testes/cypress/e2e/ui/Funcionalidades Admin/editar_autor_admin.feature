# language: pt

Funcionalidade: Edição de autor

  Contexto:
    Dado eu acesso o sistema com a visualização "web"
    E realizo login no sistema CDEP com perfil "Admin"    

  Esquema do Cenário: Validar: <caso>
    E acesso a tela Autor
    Quando crio cadastro de autor "<tipo>"
    E edito o autor salvo
    Então o sistema edita o cadastro de autor com sucesso

    Exemplos:
      | tipo    | caso                        |
      | acervo  | Editar cadastro com sucesso |

  Esquema do Cenário: Validar: <caso>
    E acesso a tela Autor
    Quando crio cadastro de autor "<tipo>"
    E edito retirando o nome do autor
    Então o nome do autor deve ser obrigatório

    Exemplos:
      | tipo    | caso                      |
      | acervo  | Nome deve ser obrigatório |




