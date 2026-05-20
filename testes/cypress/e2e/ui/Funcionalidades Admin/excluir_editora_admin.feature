# language: pt

Funcionalidade: Exclusão de Editora

  Contexto:
    Dado eu acesso o sistema com a visualização "web"
    E realizo login no sistema CDEP com perfil "Admin"    

  Esquema do Cenário: Validar: <caso>
    E acesso a tela Editora
    Quando crio cadastro de editora "<tipo>"
    E clico para excluir a editora salva
    Então o sistema exclui a editora

    Exemplos:
      | tipo    | caso                         |
      | acervo  | Excluir cadastro com sucesso |

  Esquema do Cenário: Validar: <caso>
    E acesso a tela Editora
    Quando crio cadastro de editora "<tipo>"
    E clico para excluir a editora salva
    Então o sistema cancela exclusão da editora

    Exemplos:
      | tipo    | caso                         |
      | acervo  | Cancelar exclusão da editora |




