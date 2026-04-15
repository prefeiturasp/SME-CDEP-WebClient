# language: pt

Funcionalidade: Edição de Meus Dados

  Contexto:
    Dado eu acesso o sistema com a visualização "web"
    E realizo login no sistema CDEP com perfil "Admin"
    E acesso o menu Meus Dados

  Cenário: Validar alteração do email
    Quando clico em alterar "email" nos meus dados
    Então alteração do e-mail deve ser exibido

  Esquema do Cenário: Validar a inserção: <caso>
    Quando clico em alterar "senha" nos meus dados
    Então o campo "<campo>" validar a senha inserida

    Exemplos:
      | campo             | caso                   |
      | senha atual       | Senha atual            |
      | nova senha        | Inserir nova senha     |
      | confirmação senha | Confirmação nova senha |

  Cenário: Validar alteração de senha
    Quando clico em alterar "senha" nos meus dados
    Então o campo "senha atual" validar a senha inserida
    E o campo "nova senha" validar a senha inserida
    E o campo "confirmação senha" validar a senha inserida
    Quando preencho o modal de senha com todos dados válidos
    Então realiza a alteração de senha
  
  Cenário: Validar o cancelamento da alteração
    Quando clico em alterar "email" nos meus dados
    E clico em cancelar no modal de alteração
    Então o modal de alteração não deve estar visível
  
  Cenário: Validar salvar meus dados
    Quando clico em alterar "senha" nos meus dados
    E clico em alterar no modal de dados
    Então modal de alteração dos meus dados deve fechar