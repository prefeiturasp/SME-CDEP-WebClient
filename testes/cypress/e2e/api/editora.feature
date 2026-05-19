# language: pt

Funcionalidade: API - Editora  

  Cenário: Criar cadastro de editora
    Dado que possuo um token de acesso
    Quando envio uma requisição POST editora
    Então retorna o status 200 criando editora

  Cenário: Não criar editora sem nome  
    Dado que possuo um token de acesso
    Quando envio a requisição POST editora
    Então retorna o status 422 não criando editora sem nome

  Cenário: Não criar editora sem autenticação
    Dado que não possuo um token de acesso
    Quando tento a requisição POST editora
    Então retorna o status 401 sem criar editora
  
  Cenário: Retornar editora por id
    Dado que possuo um token de acesso
    Quando envio uma requisição GET com id editora
    Então retorna o status 200 do id editora

  Cenário: Não retorna editora por id sem autenticação
    Dado que não possuo um token de acesso
    Quando tento a requisição GET com id editora
    Então retorna o status 401 sem id editora

  Cenário: Retornar editora resumido
    Dado que possuo um token de acesso
    Quando envio uma requisição GET para resumo de editora
    Então retorna o status 200 com editora resumido

  Cenário: Não retorna editora resumido sem autenticação
    Dado que não possuo um token de acesso
    Quando tento a requisição GET para resumo de editora
    Então retorna o status 401 sem editora resumido

  Cenário: Retornar cadastro de editora
    Dado que possuo um token de acesso
    Quando envio uma requisição GET para editora
    Então retorna o status 200 com editora

  Cenário: Não retorna editora sem autenticação
    Dado que não possuo um token de acesso
    Quando tento a requisição GET para editora
    Então retorna o status 401 sem editora

  Cenário: Alterar a editora
    Dado que possuo um token de acesso
    Quando envio uma requisição PUT editora
    Então retorna o status 200 alterando editora

  Cenário: Não alterar editora sem id  
    Dado que possuo um token de acesso
    Quando envio uma requisição PUT editora sem id
    Então retorna o status 422 não alterando editora sem id

  Cenário: Não alterar editora sem autenticação
    Dado que não possuo um token de acesso
    Quando tento a requisição PUT editora
    Então retorna o status 401 sem alterar editora

  Cenário: Deletar a editora
    Dado que possuo um token de acesso
    Quando envio uma requisição DELETE editora
    Então retorna o status 200 excluindo editora

  Cenário: Não deletar editora sem id  
    Dado que possuo um token de acesso
    Quando envio uma requisição DELETE editora sem id
    Então retorna o status 405 não deletando editora sem id

  Cenário: Não deletar editora sem autenticação
    Dado que não possuo um token de acesso
    Quando tento a requisição DELETE editora
    Então retorna o status 401 sem deletar editora

