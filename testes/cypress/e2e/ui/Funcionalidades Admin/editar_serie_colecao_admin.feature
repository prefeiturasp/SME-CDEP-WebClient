# language: pt

Funcionalidade: Edição de Série/Coleção

  Contexto:
    Dado eu acesso o sistema com a visualização "web"
    E realizo login no sistema CDEP com perfil "Admin"    

  Esquema do Cenário: Validar: <caso>
    E acesso a tela Série e Coleção
    Quando crio cadastro de série "<tipo>"
    E edito a série salva
    Então o sistema edita o cadastro da série com sucesso

    Exemplos:
      | tipo    | caso               |
      | acervo  | Edição do cadastro |

  Esquema do Cenário: Validar: <caso>
    E acesso a tela Série e Coleção
    Quando crio cadastro de série "<tipo>"
    E edito retirando o nome da série
    Então o nome da série deve ser obrigatório

    Exemplos:
      | tipo    | caso                      |
      | acervo  | Nome deve ser obrigatório |




