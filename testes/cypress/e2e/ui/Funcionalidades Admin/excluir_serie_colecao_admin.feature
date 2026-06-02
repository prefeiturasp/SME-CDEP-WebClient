# language: pt

Funcionalidade: Exclusão de Série/Coleção

  Contexto:
    Dado eu acesso o sistema com a visualização "web"
    E realizo login no sistema CDEP com perfil "Admin"    

  Esquema do Cenário: Validar: <caso>
    E acesso a tela Série e Coleção
    Quando crio cadastro de série "<tipo>"
    E clico para excluir a série salva
    Então o sistema exclui a série

    Exemplos:
      | tipo    | caso                 |
      | acervo  | Exclusão do cadastro |

  Esquema do Cenário: Validar: <caso>
    E acesso a tela Série e Coleção
    Quando crio cadastro de série "<tipo>"
    E clico para excluir a série salva
    Então o sistema cancela exclusão da série

    Exemplos:
      | tipo    | caso              |
      | acervo  | Cancelar exclusão |




