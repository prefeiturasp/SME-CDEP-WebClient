# language: pt

Funcionalidade: API - Série/Coleção  

  Cenário: Criar cadastro de Série/Coleção
    Dado que possuo um token de acesso
    Quando envio uma requisição POST seriecolecao
    Então retorna o status 200 criando seriecolecao

  Cenário: Não criar Série/Coleção sem nome  
    Dado que possuo um token de acesso
    Quando envio a requisição POST seriecolecao
    Então retorna o status 422 não criando seriecolecao sem nome

  Cenário: Não criar Série/Coleção sem autenticação
    Dado que não possuo um token de acesso
    Quando tento a requisição POST seriecolecao
    Então retorna o status 401 sem criar seriecolecao
  
  Cenário: Retornar Série/Coleção por id
    Dado que possuo um token de acesso
    Quando envio uma requisição GET com id seriecolecao
    Então retorna o status 200 do id seriecolecao

  Cenário: Não retorna Série/Coleção por id sem autenticação
    Dado que não possuo um token de acesso
    Quando tento a requisição GET com id seriecolecao
    Então retorna o status 401 sem id seriecolecao

  Cenário: Retornar Série/Coleção resumido
    Dado que possuo um token de acesso
    Quando envio uma requisição GET para resumo de seriecolecao
    Então retorna o status 200 com seriecolecao resumido

  Cenário: Não retorna Série/Coleção resumido sem autenticação
    Dado que não possuo um token de acesso
    Quando tento a requisição GET para resumo de seriecolecao
    Então retorna o status 401 sem seriecolecao resumido

  Cenário: Retornar cadastro de Série/Coleção
    Dado que possuo um token de acesso
    Quando envio uma requisição GET para seriecolecao
    Então retorna o status 200 com seriecolecao

  Cenário: Não retorna Série/Coleção sem autenticação
    Dado que não possuo um token de acesso
    Quando tento a requisição GET para seriecolecao
    Então retorna o status 401 sem seriecolecao

  Cenário: Alterar a Série/Coleção
    Dado que possuo um token de acesso
    Quando envio uma requisição PUT seriecolecao
    Então retorna o status 200 alterando seriecolecao

  Cenário: Não alterar Série/Coleção sem id  
    Dado que possuo um token de acesso
    Quando envio uma requisição PUT seriecolecao sem id
    Então retorna o status 422 não alterando seriecolecao sem id

  Cenário: Não alterar Série/Coleção sem autenticação
    Dado que não possuo um token de acesso
    Quando tento a requisição PUT seriecolecao
    Então retorna o status 401 sem alterar seriecolecao

  Cenário: Deletar a Série/Coleção
    Dado que possuo um token de acesso
    Quando envio uma requisição DELETE seriecolecao
    Então retorna o status 200 excluindo seriecolecao

  Cenário: Não deletar Série/Coleção sem id  
    Dado que possuo um token de acesso
    Quando envio uma requisição DELETE seriecolecao sem id
    Então retorna o status 405 não deletando seriecolecao sem id

  Cenário: Não deletar Série/Coleção sem autenticação
    Dado que não possuo um token de acesso
    Quando tento a requisição DELETE seriecolecao
    Então retorna o status 401 sem deletar seriecolecao

