# language: pt

Funcionalidade: API - Conservacao

  Cenário: Cria novo nome de conservação
    Dado que possuo um token de acesso
    Quando envio uma requisição POST com nome de conservação
    Então retorna o status 200 criando novo nome de conservação

  Cenário: Nome de conservação deve ser informado
    Dado que possuo um token de acesso
    Quando envio uma requisição POST sem conservação
    Então retorna o status 601 o nome de conservação deve ser informado

  Cenário: Não insere nome de conservação duplicado
    Dado que possuo um token de acesso
    Quando envio uma requisição POST com o mesmo nome de conservação
    Então retorna o status 601 sem inserir nome de conservação duplicado

  Cenário: Não cria novo nome de conservação sem autenticação
    Dado que não possuo um token de acesso
    Quando tento uma requisição POST com nome de conservação
    Então não cria novo nome de conservação sem autenticação
  
  Cenário: Busca por todas conservação
    Dado que possuo um token de acesso
    Quando envio uma requisição GET sem conservacao especifico
    Então retorna o status 200 com todos conservacao

  Cenário: Não busca todos conservação sem autenticação
    Dado que não possuo um token de acesso
    Quando tento uma requisição GET sem conservacao especifico
    Então não busca todos conservacao sem autenticação retornando o status 401

  Cenário: Busca por id do conservação
    Dado que possuo um token de acesso
    Quando envio uma requisição GET de id conservacao
    Então retorna o status 200 os dados do conservacao

  Cenário: Busca por id do conservação inválido
    Dado que possuo um token de acesso
    Quando envio a requisição GET de id conservacao inexistente
    Então retorna o status 422 que conservacao é inválido

  Cenário: Não busca por id conservação sem autenticação
    Dado que não possuo um token de acesso
    Quando tento a requisição GET de id conservacao
    Então não busca por id do conservacao sem autenticação retornando o status 401

  Cenário: Alterar o registro de conservação
    Dado que possuo um token de acesso
    Quando envio uma requisição PUT com id e nome de conservação
    Então retorna o status 200 alterando conservação

  Cenário: ID deve ser informado para alterar conservação
    Dado que possuo um token de acesso
    Quando envio uma requisição PUT sem id de conservação
    Então retorna o status 422 que ID deve ser informado para alterar conservação

  Cenário: Não altera conservação sem autenticação
    Dado que não possuo um token de acesso
    Quando tento a requisição PUT com id e nome de conservação
    Então não altera conservação sem autenticação retornando o status 401

  Cenário: Excluir registro conservação
    Dado que possuo um token de acesso
    Quando envio uma requisição DELETE com id nome conservação
    Então retorna o status 200 excluindo conservação

  Cenário: Id deve ser informado para excluir conservação
    Dado que possuo um token de acesso
    Quando envio uma requisição DELETE sem id nome conservação
    Então retorna o status 422 que id informado para excluir conservação

  Cenário: Não excluir conservação sem autenticação
    Dado que não possuo um token de acesso
    Quando tento uma requisição DELETE com id nome conservação
    Então não exclui conservação sem autenticação retornando o status 401