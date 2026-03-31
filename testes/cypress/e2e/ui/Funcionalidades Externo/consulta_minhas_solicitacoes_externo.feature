# language: pt

Funcionalidade: Consulta através da tela Minhas solicitações

  Contexto:
    Dado eu acesso o sistema com a visualização "<visualizacao>"
    E realizo login no sistema CDEP com perfil "Externo"

  Esquema do Cenário: Validar a exibição na tela: <caso>  
    Quando visualizo a tela "Minhas solicitações"      
    Então exibe o "<campo>" na tabela da minha solicitação
   
    Exemplos:
      | visualizacao | campo              | caso                  |
      | web          | número             | Número da solicitação | 
      | web          | tipo de item       | Tipo de acervo        |     
      | web          | título do item     | Título                |  
      | web          | dia da solicitação | Data da solicitação   |
      | web          | dia de visita      | Data da visita        |
      | web          | status             | Situação              |

  Esquema do Cenário: Validar a consulta da: <caso>  
    Quando visualizo a tela "Minhas solicitações"      
    Então consulta a minha solicitação cadastrada
   
    Exemplos:
      | visualizacao | campo              | caso                   |
      | web          | número             | Solicitação cadastrada | 

  Esquema do Cenário: Validar a exibição na solicitação: <caso>
    E visualizo a tela "Minhas solicitações"
    Quando clico na solicitação cadastrada
    Então exibe o "<campo>" da minha solicitação

    Exemplos:
      | visualizacao | campo          | caso                |
      | web          | tipo de item   | Tipo de acervo      |
      | web          | título do item | Título              |
      | web          | autor          | Autor/Crédito       |
      | web          | status         | Situação            |
      | web          | atendimento    | Tipo de atendimento |
      | web          | visita         | Data da visita      |
