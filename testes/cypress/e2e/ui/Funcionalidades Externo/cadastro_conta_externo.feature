# language: pt

Funcionalidade: Criar conta de usuário

  Contexto:
    Dado eu acesso o sistema com a visualização "<visualizacao>"

  Esquema do Cenário: Validar: <caso>  
    E clico no botão "Crie a sua conta" da tela "Login"
    Quando insiro os dados de usuário
    E clico em "Cadastre-se"
    Então sistema cria o usuário com sucesso
   
    Exemplos:
      | visualizacao |  caso                          |
      | web          | Usuário cadastrado com sucesso |
