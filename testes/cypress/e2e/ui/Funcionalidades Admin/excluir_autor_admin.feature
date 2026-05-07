# language: pt

Funcionalidade: Exclusão de autor

  Contexto:
    Dado eu acesso o sistema com a visualização "web"
    E realizo login no sistema CDEP com perfil "Admin"    

  Esquema do Cenário: Validar: <caso>
    E acesso a tela Autor
    Quando crio cadastro de autor "<tipo>"
    E clico para excluir o autor salvo
    Então o sistema exclui o autor

    Exemplos:
      | tipo    | caso                         |
      | acervo  | Excluir cadastro com sucesso |

  Esquema do Cenário: Validar: <caso>
    E acesso a tela Autor
    Quando crio cadastro de autor "<tipo>"
    E clico para excluir o autor salvo
    Então o sistema cancela exclusão do autor

    Exemplos:
      | tipo    | caso                       |
      | acervo  | Cancelar exclusão do autor |




