# language: pt

Funcionalidade: Consulta de Dashboards

  Contexto:
    Dado eu acesso o sistema com a visualização "web"
    E realizo login no sistema CDEP com perfil "Admin"    

  Esquema do Cenário: Validar a consulta: <caso>
    Quando acesso o Painel de indicadores
    Então consulta os dados do dashboard "<tipo>"

    Exemplos:
      | tipo                        | caso                                                  |
      | acervos                     | Acervos cadastrados                                   |
      | solicitações                | Solicitações por situação                             |
      | livros emprestados          | Controle de livros emprestados                        |
      | solicitações e atendimentos | Quantidade de solicitações e atendimentos por período |
      | pesquisas mensais           | Quantidade de pesquisas mensais                       |
      | tipos de acervo             | Solicitações por tipo de acervo                       |

  Esquema do Cenário: Validar filtro na consulta: <caso>
    Quando acesso o Painel de indicadores
    Então navega até o dashboard "<tipo>"

    Exemplos:
      | tipo                        | caso                                                  |
      | solicitações e atendimentos | Quantidade de solicitações e atendimentos por período |
      | tipos de acervo             | Solicitações por tipo de acervo                       |