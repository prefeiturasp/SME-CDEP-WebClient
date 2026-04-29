# language: pt

Funcionalidade: Exclusão de Assunto

  Contexto:
    Dado eu acesso o sistema com a visualização "web"
    E realizo login no sistema CDEP com perfil "Admin"    

  Esquema do Cenário: Validar: <caso>
    E acesso a tela Assunto
    Quando crio cadastro de assunto "<tipo>"
    E clico para excluir o assunto salvo
    Então o sistema exclui o assunto

    Exemplos:
      | tipo    | caso                         |
      | acervo  | Excluir cadastro com sucesso |

  Esquema do Cenário: Validar: <caso>
    E acesso a tela Assunto
    Quando crio cadastro de assunto "<tipo>"
    E clico para excluir o assunto salvo
    Então o sistema cancela exclusão do assunto

    Exemplos:
      | tipo    | caso                         |
      | acervo  | Cancelar exclusão do assunto |




