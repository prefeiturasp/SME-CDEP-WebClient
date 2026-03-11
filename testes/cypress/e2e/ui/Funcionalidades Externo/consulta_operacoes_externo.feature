# language: pt

Funcionalidade: Consulta de acervos através do menu Operações

  Contexto:
    Dado eu acesso o sistema com a visualização "<visualizacao>"
    E realizo login no sistema CDEP com perfil "Externo"

  Esquema do Cenário: Validar consulta de acervos ao: <caso>  
    E clico no botão "Nova Solicitação" em "Operações"
    Quando adiciono os acervos
    Então sistema apresenta a '<mensagem>' na tela
   
    Exemplos:
      | visualizacao | mensagem                           | caso               |
      | web          | Solicitação realizada com sucesso. | Criar solicitação |

  Esquema do Cenário: Validar item pesquisado ao: <caso>  
    E clico no botão "Nova Solicitação" em "Operações"
    Quando tenho acervo adicionado
    E clico no botão de remover
    Então o item não é apresentado na listagem
   
    Exemplos:
      | visualizacao | caso           |
      | web          | Remover acervo |
  
  Esquema do Cenário: Validar cancelamento após pesquisa de item: <caso>  
    E clico no botão "Nova Solicitação" em "Operações"
    Quando tenho acervo adicionado
    E clico no botão de retornar ao lado de "Enviar solicitação"
    Então retorna a tela "Minhas solicitações"
   
    Exemplos:
      | visualizacao | caso                            |
      | web          | Retornar a tela de solicitações | 

  Esquema do Cenário: Validar consulta de acervo do tipo: <caso>  
    E clico no botão "Nova Solicitação" em "Operações"
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