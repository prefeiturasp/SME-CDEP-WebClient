# language: pt

Funcionalidade: API - Assunto

  Cenário: Busca por todos os assuntos
    Dado que possuo um token de acesso
    Quando envio uma requisição GET sem assunto específico
    Então retorna o status 200 com todos os assuntos

  Cenário: Busca por assunto específico
    Dado que possuo um token de acesso
    Quando envio uma requisição GET com assunto
    Então retorna o status 200 com os dados do assunto específico

  Cenário: Não busca por assunto sem autenticação
    Dado que não possuo um token de acesso
    Quando tento uma requisição GET de assunto
    Então não busca por assunto sem autenticação retornando o status 401

  Cenário: Busca por assunto resumido
    Dado que possuo um token de acesso
    Quando envio a requisição GET
    Então retorna o status 200 com assunto resumido

  Cenário: Não busca por assunto resumido sem autenticação
    Dado que não possuo um token de acesso
    Quando tento uma requisição GET
    Então não busca por assunto resumido sem autenticação retornando o status 401

  Cenário: Busca por todos itens de assuntos
    Dado que possuo um token de acesso
    Quando envio uma requisição GET de assunto
    Então retorna o status 200 com itens de assuntos

  Cenário: Busca por id do assunto
    Dado que possuo um token de acesso
    Quando envio uma requisição GET do id assunto
    Então retorna o status 200 os dados do assunto

  Cenário: Não busca por id do assunto sem autenticação
    Dado que não possuo um token de acesso
    Quando tento a requisição GET de assunto
    Então não busca por id do assunto sem autenticação retornando o status 401

  Cenário: Cria novo assunto
    Dado que possuo um token de acesso
    Quando envio uma requisição POST
    Então retorna o status 200 criando o novo assunto

  Cenário: Nome do assunto deve ser informado
    Dado que possuo um token de acesso
    Quando envio uma requisição POST sem preenchimento
    Então retorna o status 601 o nome do assunto deve ser informado

  Cenário: Não insere nome existente
    Dado que possuo um token de acesso
    Quando envio uma requisição POST com o mesmo preenchimento
    Então retorna o status 601 sem inserir nome existente

  Cenário: Não cria novo assunto sem autenticação
    Dado que não possuo um token de acesso
    Quando tento uma requisição POST
    Então não cria novo assunto sem autenticação retornando o status 401

  Cenário: Altera o cadastro do assunto
    Dado que possuo um token de acesso
    Quando envio uma requisição PUT
    Então retorna o status 200 alterando o cadastro do assunto

  Cenário: Nome do assunto deve ser informado na alteração
    Dado que possuo um token de acesso
    Quando envio uma requisição PUT sem preenchimento
    Então retorna o status 601 que o nome do assunto deve ser informado na alteração

  Cenário: Não altera nome existente
    Dado que possuo um token de acesso
    Quando envio uma requisição PUT com o mesmo preenchimento
    Então retorna o status 601 não alterando nome existente

  Cenário: Não altera o cadastro do assunto sem autenticação
    Dado que não possuo um token de acesso
    Quando tento uma requisição PUT
    Então não altera assunto sem autenticação retornando o status 401

  Cenário: Deletar o cadastro do assunto
    Dado que possuo um token de acesso
    Quando envio uma requisição DELETE
    Então retorna o status 200 deletando o cadastro do assunto

  Cenário: Não deleta o assunto sem ID
    Dado que possuo um token de acesso
    Quando envio uma requisição DELETE sem o assunto
    Então retorna o status 405 que não foi possível deletar o assunto sem ID

  Cenário: Não deleta o assunto com ID inválido
    Dado que possuo um token de acesso
    Quando envio uma requisição DELETE com o assunto inválido
    Então retorna o status 500 que não foi possível deletar o assunto inválido

  Cenário: Não deletar o cadastro do assunto sem autenticação
    Dado que não possuo um token de acesso
    Quando tento uma requisição DELETE
    Então não deleta assunto sem autenticação retornando o status 401