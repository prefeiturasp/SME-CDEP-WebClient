# language: pt

Funcionalidade: Edição de Editora

  Contexto:
    Dado eu acesso o sistema com a visualização "web"
    E realizo login no sistema CDEP com perfil "Admin"    

  Esquema do Cenário: Validar: <caso>
    E acesso a tela Editora
    Quando crio cadastro de editora "<tipo>"
    E edito a editora salva
    Então o sistema edita o cadastro de editora com sucesso

    Exemplos:
      | tipo    | caso                        |
      | acervo  | Editar cadastro com sucesso |

  Esquema do Cenário: Validar: <caso>
    E acesso a tela Editora
    Quando crio cadastro de editora "<tipo>"
    E edito retirando o nome da editora
    Então o nome da editora deve ser obrigatório

    Exemplos:
      | tipo    | caso                      |
      | acervo  | Nome deve ser obrigatório |




