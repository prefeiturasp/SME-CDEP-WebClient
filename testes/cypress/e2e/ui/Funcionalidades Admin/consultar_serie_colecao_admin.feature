# language: pt

Funcionalidade: Consulta de Série/Coleção

  Contexto:
    Dado eu acesso o sistema com a visualização "web"
    E realizo login no sistema CDEP com perfil "Admin"    

  Esquema do Cenário: Validar: <caso>
    E acesso a tela Série e Coleção
    Quando crio cadastro de série "<tipo>"
    E clico na série salva
    Então o sistema exibe o cadastro da série

    Exemplos:
      | tipo    | caso                  |
      | acervo  | Consulta de cadastro  |
      | acervo  | Nome deve ser exibido |





