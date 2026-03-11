# language: pt

Funcionalidade: API - Acervos solicitação

  Cenário: Retornar o acervo solicitação
    Dado que possuo um token de acesso
    Quando envio uma requisição GET com id do acervo
    Então retorna o status 200 com o acervo solicitação

  Cenário: Não retornar sem acervo solicitação
    Dado que possuo um token de acesso
    Quando envio uma requisição GET sem id acervo
    Então não retornar sem acervo solicitação
  
  Cenário: Não retornar acervo solicitação sem autenticação
    Dado que não possuo um token de acesso
    Quando tento a requisição GET das condições aceitas
    Então retorna o status 401 sem o termo de compromisso

  Cenário: Retornar o acervo solicitação por id
    Dado que possuo um token de acesso
    Quando envio uma requisição GET com id do acervo solicitado
    Então retorna o status 200 com o acervo solicitação por id

  Cenário: Não retornar sem acervo solicitação por id
    Dado que possuo um token de acesso
    Quando envio uma requisição GET sem id acervo solicitado
    Então não retornar sem acervo solicitação por id
  
  Cenário: Não retornar o acervo solicitação por id sem autenticação
    Dado que não possuo um token de acesso
    Quando tento a requisição GET com id do acervo solicitado
    Então retorna o status 401 sem acervo solicitação por id

  Cenário: Retornar o acervo da minha solicitação
    Dado que possuo um token de acesso
    Quando envio uma requisição GET acervo solicitado
    Então retorna o status 200 com o acervo da minha solicitação

  Cenário: Não retornar sem acervo da minha solicitação
    Dado que possuo um token de acesso
    Quando envio uma requisição GET sem acervo solicitado
    Então não retornar sem acervo da minha solicitação
  
  Cenário: Não retornar o acervo da minha solicitação sem autenticação
    Dado que não possuo um token de acesso
    Quando tento a requisição GET acervo solicitado
    Então retorna o status 401 sem acervo da minha solicitação