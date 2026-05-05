# language: pt

Funcionalidade: API - Crédito autor

  Cenário: Retornar o crédito autor resumido
    Dado que possuo um token de acesso
    Quando envio uma requisição GET para resumo de crédito autor
    Então retorna o status 200 com o crédito autor resumido

  Cenário: Retornar o crédito autor resumido do tipo 1
    Dado que possuo um token de acesso
    Quando envio uma requisição GET para crédito resumido 1
    Então retorna o status 200 com o crédito autor resumido do tipo 1

  Cenário: Retornar o crédito autor resumido do tipo 2
    Dado que possuo um token de acesso
    Quando envio uma requisição GET para crédito resumido 2
    Então retorna o status 200 com o crédito autor resumido do tipo 2

  Cenário: Retornar o crédito autor resumido do tipo 3
    Dado que possuo um token de acesso
    Quando envio uma requisição GET para crédito resumido 3
    Então retorna o status 200 com o crédito autor resumido do tipo 3

  Cenário: Não retorna crédito autor resumido sem autenticação
    Dado que não possuo um token de acesso
    Quando tento a requisição GET para resumo de crédito autor
    Então retorna o status 401 sem crédito autor resumido

  Cenário: Retornar o crédito autor
    Dado que possuo um token de acesso
    Quando envio uma requisição GET para crédito autor
    Então retorna o status 200 com o crédito autor

  Cenário: Retornar o crédito autor do tipo 1
    Dado que possuo um token de acesso
    Quando envio uma requisição GET para crédito 1
    Então retorna o status 200 com o crédito autor do tipo 1

  Cenário: Retornar o crédito autor do tipo 2
    Dado que possuo um token de acesso
    Quando envio uma requisição GET para crédito 2
    Então retorna o status 200 com o crédito autor do tipo 2

  Cenário: Retornar o crédito autor do tipo 3
    Dado que possuo um token de acesso
    Quando envio uma requisição GET para crédito 3
    Então retorna o status 200 com o crédito autor do tipo 3

  Cenário: Não retorna crédito autor sem autenticação
    Dado que não possuo um token de acesso
    Quando tento a requisição GET para crédito autor
    Então retorna o status 401 sem crédito autor

  Cenário: Retornar o crédito autor por id
    Dado que possuo um token de acesso
    Quando envio uma requisição GET com id crédito autor
    Então retorna o status 200 do id crédito autor

  Cenário: Não retorna crédito autor por id sem autenticação
    Dado que não possuo um token de acesso
    Quando tento a requisição GET com id crédito autor
    Então retorna o status 401 sem id crédito autor

  Cenário: Criar o crédito autor
    Dado que possuo um token de acesso
    Quando envio uma requisição POST crédito autor
    Então retorna o status 200 criando crédito autor

  Cenário: Não criar o crédito autor sem nome  
    Dado que possuo um token de acesso
    Quando envio a requisição POST crédito autor
    Então retorna o status 422 não criando crédito autor sem nome

  Cenário: Não criar crédito autor sem autenticação
    Dado que não possuo um token de acesso
    Quando tento a requisição POST crédito autor
    Então retorna o status 401 sem criar crédito autor

  Cenário: Alterar o crédito autor
    Dado que possuo um token de acesso
    Quando envio uma requisição PUT crédito autor
    Então retorna o status 200 alterando crédito autor

  Cenário: Não alterar crédito autor sem id  
    Dado que possuo um token de acesso
    Quando envio uma requisição PUT crédito autor sem id
    Então retorna o status 422 não alterando crédito autor sem id

  Cenário: Não alterar crédito autor sem autenticação
    Dado que não possuo um token de acesso
    Quando tento a requisição PUT crédito autor
    Então retorna o status 401 sem alterar crédito autor

  Cenário: Deletar o crédito autor
    Dado que possuo um token de acesso
    Quando envio uma requisição DELETE crédito autor
    Então retorna o status 200 excluindo crédito autor

  Cenário: Não deletar crédito autor sem id  
    Dado que possuo um token de acesso
    Quando envio uma requisição DELETE crédito autor sem id
    Então retorna o status 405 não deletando crédito autor sem id

  Cenário: Não deletar crédito autor sem autenticação
    Dado que não possuo um token de acesso
    Quando tento a requisição DELETE crédito autor
    Então retorna o status 401 sem deletar crédito autor

