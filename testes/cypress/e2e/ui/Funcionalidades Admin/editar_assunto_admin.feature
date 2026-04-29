# language: pt

Funcionalidade: Edição de Assunto

  Contexto:
    Dado eu acesso o sistema com a visualização "web"
    E realizo login no sistema CDEP com perfil "Admin"    

  Esquema do Cenário: Validar: <caso>
    E acesso a tela Assunto
    Quando crio cadastro de assunto "<tipo>"
    E edito o assunto salvo
    Então o sistema edita o cadastro com sucesso

    Exemplos:
      | tipo    | caso                        |
      | acervo  | Editar cadastro com sucesso |

  Esquema do Cenário: Validar: <caso>
    E acesso a tela Assunto
    Quando crio cadastro de assunto "<tipo>"
    E edito retirando o nome do assunto
    Então o nome do assunto deve ser obrigatório

    Exemplos:
      | tipo    | caso                      |
      | acervo  | Nome deve ser obrigatório |




