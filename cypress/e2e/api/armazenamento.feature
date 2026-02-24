# language: pt

Funcionalidade: API - Armazenamento

  Cenário: Armazena um arquivo válido
    Dado que gerou um token de acesso
    Quando envio uma requisição POST de armazenamento
    Então retorna status 200 armazenando um arquivo válido

  Cenário: Não armazena tamanho excedido
    Dado que possuo um token de acesso
    Quando envio uma requisição POST além de 10 MB
    Então retorna o status 413 que não armazena tamanho excedido

  Cenário: Obrigatório é arquivo no envio
    Dado que possuo um token de acesso
    Quando envio uma requisição POST vazio
    Então retorna o status 422 que obrigatório é arquivo no envio

  Cenário: Não armazena sem autenticação
    Dado que não possuo um token de acesso
    Quando tento a requisição POST de armazenamento
    Então retorna o status 401 sem armazenar o arquivo válido

    Cenário: Retornar o arquivo armazenado
    Dado que gerou um token de acesso
    Quando envio uma requisição GET do código arquivo 
    Então retorna status 200 com o arquivo armazenado

  Cenário: Não retornar arquivo armazenado
    Dado que possuo um token de acesso
    Quando envio uma requisição GET do código arquivo inexistente
    Então retorna o status 422 sem retornar arquivo armazenado

  Cenário: Não retornar arquivo sem código
    Dado que possuo um token de acesso
    Quando envio uma requisição GET sem o código
    Então retorna o status 405 sem retornar arquivo sem código

  Cenário: Não busca arquivo armazenado sem autenticação
    Dado que não possuo um token de acesso
    Quando tento a requisição GET do código arquivo
    Então retorna o status 401 sem buscar arquivo armazenado sem autenticação

  Cenário: Armazena o arquivo do tipo 1 válido
    Dado que gerou um token de acesso
    Quando envio uma requisição POST de armazenamento do tipo 1
    Então retorna status 200 armazenando um arquivo do tipo 1 válido

  Cenário: Armazena o arquivo do tipo 2 válido
    Dado que gerou um token de acesso
    Quando envio uma requisição POST de armazenamento do tipo 2
    Então retorna status 200 armazenando um arquivo do tipo 2 válido

  Cenário: Armazena o arquivo do tipo 3 válido
    Dado que gerou um token de acesso
    Quando envio uma requisição POST de armazenamento do tipo 3
    Então retorna status 200 armazenando um arquivo do tipo 3 válido

  Cenário: Armazena o arquivo do tipo 4 válido
    Dado que gerou um token de acesso
    Quando envio uma requisição POST de armazenamento do tipo 4
    Então retorna status 200 armazenando um arquivo do tipo 4 válido

  Cenário: Armazena o arquivo do tipo 5 válido
    Dado que gerou um token de acesso
    Quando envio uma requisição POST de armazenamento do tipo 5
    Então retorna status 200 armazenando um arquivo do tipo 5 válido

  Cenário: Armazena o arquivo do tipo 6 válido
    Dado que gerou um token de acesso
    Quando envio uma requisição POST de armazenamento do tipo 6
    Então retorna status 200 armazenando um arquivo do tipo 6 válido

  Cenário: Armazena o arquivo do tipo 7 válido
    Dado que gerou um token de acesso
    Quando envio uma requisição POST de armazenamento do tipo 7
    Então retorna status 200 armazenando um arquivo do tipo 7 válido

  Cenário: Não armazena o arquivo com tipo inexistente
    Dado que gerou um token de acesso
    Quando envio uma requisição POST de armazenamento do tipo inválido
    Então retorna status 422 não armazenando um arquivo com tipo inexistente

  Cenário: Não armazena arquivo tipo com tamanho excedido
    Dado que possuo um token de acesso
    Quando envio uma requisição POST do tipo além de 10 MB
    Então retorna o status 413 que não armazena arquivo com tamanho excedido

  Cenário: Obrigatório é arquivo no envio de tipo
    Dado que possuo um token de acesso
    Quando envio uma requisição POST vazio no tipo
    Então retorna o status 422 que obrigatório no arquivo de envio

  Cenário: Não armazena arquivo tipo sem autenticação
    Dado que não possuo um token de acesso
    Quando tento a requisição POST de armazenamento de tipo
    Então retorna o status 401 sem armazenar o arquivo tipo válido

  Cenário: Retorna o arquivo armazenado do tipo 1
    Dado que gerou um token de acesso
    Quando envio uma requisição GET no armazenamento do tipo 1
    Então retorna status 200 com arquivo armazenado do tipo 1

  Cenário: Retorna o arquivo armazenado do tipo 2
    Dado que gerou um token de acesso
    Quando envio uma requisição GET no armazenamento do tipo 2
    Então retorna status 200 com arquivo armazenado do tipo 2

  Cenário: Retorna o arquivo armazenado do tipo 3
    Dado que gerou um token de acesso
    Quando envio uma requisição GET no armazenamento do tipo 3
    Então retorna status 200 com arquivo armazenado do tipo 3

  Cenário: Retorna o arquivo armazenado do tipo 4
    Dado que gerou um token de acesso
    Quando envio uma requisição GET no armazenamento do tipo 4
    Então retorna status 200 com arquivo armazenado do tipo 4

  Cenário: Retorna o arquivo armazenado do tipo 5
    Dado que gerou um token de acesso
    Quando envio uma requisição GET no armazenamento do tipo 5
    Então retorna status 200 com arquivo armazenado do tipo 5

  Cenário: Retorna o arquivo armazenado do tipo 6
    Dado que gerou um token de acesso
    Quando envio uma requisição GET no armazenamento do tipo 6
    Então retorna status 200 com arquivo armazenado do tipo 6

  Cenário: Não retorna o arquivo armazenado com tipo inexistente
    Dado que gerou um token de acesso
    Quando envio uma requisição GET no armazenamento do tipo inválido
    Então retorna status 422 não retorna o arquivo armazenado com tipo inexistente

  Cenário: Obrigatório tipo de arquivo na busca
    Dado que possuo um token de acesso
    Quando envio uma requisição GET com tipo vazio
    Então retorna o status 422 que obrigatório no tipo de arquivo

  Cenário: Não retorna arquivo armazenado tipo sem autenticação
    Dado que não possuo um token de acesso
    Quando tento a requisição GET no armazenamento do tipo arquivo
    Então retorna o status 401 sem arquivo armazenado tipo