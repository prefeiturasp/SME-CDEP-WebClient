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

  Esquema do Cenário: Validar campo obrigatório: <caso>
    E clico no botão "Crie a sua conta" da tela "Login"
    Quando preencho o formulário de usuário sem informar o campo "<caso>"
    E clico em "Cadastre-se"
    Então o sistema exibe a mensagem de campo obrigatório de usuário

    Exemplos:
    | caso               |
    | cpf                |
    | nome               |
    | telefone           |
    | email              |
    | confirmação email  |
    | cep                |
    | endereço           |
    | número             |
    | bairro             |
    | cidade             |
    | estado             |
    | tipo               |
    | instituição        |
    | senha              |
    | confirmação senha  |

