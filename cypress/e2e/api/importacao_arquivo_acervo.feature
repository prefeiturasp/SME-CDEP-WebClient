# language: pt

Funcionalidade: API - Remover importação do arquivo acervo 

  Cenário: Remove a importação de arquivo do acervo 
    Dado que possuo um token de acesso
    Quando envio uma requisição DELETE
    Então remove a importação de arquivo do acervo com status 200

  Cenário: Código da importação de arquivo é obrigatório
    Dado que possuo um token de acesso
    Quando envio uma requisição DELETE sem o código
    Então retorna o status 404 que o código da importação de arquivo é obrigatório

  Cenário: Não remove a importação de arquivo sem autenticação
    Dado que não possuo um token de acesso
    Quando tento a requisição DELETE
    Então não remove a importação de arquivo retornando o status 401
