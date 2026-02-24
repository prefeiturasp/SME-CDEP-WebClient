# language: pt

Funcionalidade: API - Acesso documento
  
  Cenário: Cria novo nome de acesso documento
    Dado que possuo um token de acesso
    Quando envio uma requisição POST com nome de acesso
    Então retorna o status 200 criando novo nome de acesso documento

  Cenário: Nome do acesso deve ser informado
    Dado que possuo um token de acesso
    Quando envio uma requisição POST sem acesso
    Então retorna o status 601 o nome do acesso deve ser informado

  Cenário: Não insere nome de acesso duplicado
    Dado que possuo um token de acesso
    Quando envio uma requisição POST com o mesmo nome
    Então retorna o status 601 sem inserir nome de acesso duplicado

  Cenário: Não cria novo nome de acesso documento sem autenticação
    Dado que não possuo um token de acesso
    Quando tento uma requisição POST com nome de acesso
    Então não cria novo nome de acesso documento sem autenticação

  Cenário: Busca por todos acessos documentos
    Dado que possuo um token de acesso
    Quando envio uma requisição GET sem documentos específico
    Então retorna o status 200 com todos acessos documentos

  Cenário: Não busca todos acessos documentos sem autenticação
    Dado que não possuo um token de acesso
    Quando tento uma requisição GET sem documentos específico
    Então não busca todos acessos documentos sem autenticação retornando o status 401

  Cenário: Busca por id do acesso documento
    Dado que possuo um token de acesso
    Quando envio uma requisição GET de id acesso documento
    Então retorna o status 200 os dados do acesso documento

  Cenário: Busca por id do acesso documento inválido
    Dado que possuo um token de acesso
    Quando envio a requisição GET de id acesso inexistente
    Então retorna o status 422 que acesso documento inválido

  Cenário: Não busca por id do acesso documento sem autenticação
    Dado que não possuo um token de acesso
    Quando tento a requisição GET de id acesso documento
    Então não busca por id do acesso documento sem autenticação retornando o status 401

  Cenário: Alterar o acesso documento
    Dado que possuo um token de acesso
    Quando envio uma requisição PUT com id e nome do acesso
    Então retorna o status 200 alterando o acesso documento

  Cenário: ID deve ser informado para alterar o acesso documento
    Dado que possuo um token de acesso
    Quando envio uma requisição PUT sem id do acesso
    Então retorna o status 422 que ID deve ser informado para alterar o acesso documento

  Cenário: Não altera o acesso documento sem autenticação
    Dado que não possuo um token de acesso
    Quando tento a requisição PUT com id e nome do acesso
    Então não altera o acesso documento sem autenticação retornando o status 401

  Cenário: Excluir o acesso documento
    Dado que possuo um token de acesso
    Quando envio uma requisição DELETE com id nome do acesso
    Então retorna o status 200 excluindo o acesso documento

  Cenário: Id deve ser informado para excluir o acesso documento
    Dado que possuo um token de acesso
    Quando envio uma requisição DELETE sem id nome do acesso
    Então retorna o status 422 que id informado para excluir o acesso documento

  Cenário: Não excluir o acesso documento sem autenticação
    Dado que não possuo um token de acesso
    Quando tento uma requisição DELETE com id nome do acesso
    Então não exclui o acesso documento sem autenticação retornando o status 401
    