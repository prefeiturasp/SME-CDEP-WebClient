# language: pt

Funcionalidade: Consulta de acervos através da tela Minhas solicitações

  Contexto:
    Dado eu acesso o sistema com a visualização "<visualizacao>"
    E realizo login no sistema CDEP com perfil "Externo"

  Esquema do Cenário: Validar pesquisa de acervo ao: <caso>  
    E clico no botão "Nova Solicitação" da tela "Minhas solicitações"
    Quando adiciono os acervos
    Então sistema apresenta a '<mensagem>' na tela
   
    Exemplos:
      | visualizacao | mensagem                           | caso               |
      | web          | Solicitação realizada com sucesso. | Enviar solicitação |

  Esquema do Cenário: Validar item retirado na pesquisa: <caso>  
    E clico no botão "Nova Solicitação" da tela "Minhas solicitações"
    Quando tenho acervo adicionado
    E clico no botão de remover
    Então o item não é apresentado na listagem
   
    Exemplos:
      | visualizacao | caso            |
      | web          | Acervo removido |
  
  Esquema do Cenário: Validar cancelamento de consulta ao: <caso>  
    E clico no botão "Nova Solicitação" da tela "Minhas solicitações"
    Quando tenho acervo adicionado
    E clico no botão de retornar ao lado de "Enviar solicitação"
    Então retorna a tela "Minhas solicitações"
   
    Exemplos:
      | visualizacao | caso                            |
      | web          | Retornar a tela de solicitações |

  Esquema do Cenário: Validar modal do termo de compromisso: <caso>  
    E clico no botão "Nova Solicitação" da tela "Minhas solicitações"
    Quando clico em enviar a solicitação do acervo
    E clico no "<botao>" do TERMO DE COMPROMISSO DO PESQUISADOR CDEP
    Então o modal do pesquisador é fechado
   
    Exemplos:
      | visualizacao | botao      | caso                          |
      | web          | cancelar   | Clicar no botão de cancelar   |   
      | web          | fechar     | Clicar no botão de fechar     |  
      | web          | prosseguir | Clicar no botão de prosseguir |  

  Esquema do Cenário: Validar busca de acervo por tipo: <caso>  
    E clico no botão "Nova Solicitação" da tela "Minhas solicitações"
    Quando aciono o botão de adicionar acervos
    E clico no "<campo>" inserindo o "<valor>" na tela de consulta acervo
    Então realiza a busca do acervo
   
    Exemplos:
      | visualizacao | campo          | valor                | caso                 |
      | web          | Busca          | teste                | Texto livre          | 
      | web          | Tipo de acervo | Bibliográfico        | Bibliográfico        |     
      | web          | Tipo de acervo | Documentação textual | Documentação textual |  
      | web          | Tipo de acervo | Artes gráficas       | Artes gráficas       |
      | web          | Tipo de acervo | Audiovisual          | Audiovisual          |
      | web          | Tipo de acervo | Fotográfico          | Fotográfico          |
      | web          | Tipo de acervo | Tridimensional       | Tridimensional       |
      | web          | Buscar         |                      | Retornar todos       |
      | web          | Limpar busca   | teste                | Remover filtros      |