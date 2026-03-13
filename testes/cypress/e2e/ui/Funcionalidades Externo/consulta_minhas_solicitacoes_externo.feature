# language: pt

Funcionalidade: Consulta através da tela Minhas solicitações

  Contexto:
    Dado eu acesso o sistema com a visualização "<visualizacao>"
    E realizo login no sistema CDEP com perfil "Externo"

  Esquema do Cenário: Validar a exibição do: <caso>  
    Quando visualizo a tela "Minhas solicitações"      
    Então exibe o "<campo>" da solicitação
   
    Exemplos:
      | visualizacao | campo              | caso                  |
      | web          | número             | Número da solicitação | 
      | web          | tipo de item       | Tipo de acervo        |     
      | web          | título do item     | Título                |  
      | web          | dia da solicitação | Data da solicitação   |
      | web          | dia de visita      | Data da visita        |
      | web          | status             | Situação              |
