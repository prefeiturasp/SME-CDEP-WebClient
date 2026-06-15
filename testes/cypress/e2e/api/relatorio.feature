# language: pt

Funcionalidade: API - Relatório

  Cenário: Gerar relatório de controle de acervo
    Dado que possuo um token de acesso
    Quando envio uma requisição POST no controle de acervo
    Então gera o controle de acervo com status 200

  Cenário: Situação obrigatória ao gerar relatório de controle de acervo
    Dado que possuo um token de acesso
    Quando envio uma requisição POST no controle de acervo sem situação
    Então situação é obrigatório ao gerar relatório de controle de acervo

  Cenário: Tipo obrigatório ao gerar relatório de controle de acervo
    Dado que possuo um token de acesso
    Quando envio uma requisição POST no controle de acervo sem tipo
    Então tipo é obrigatório ao gerar relatório de controle de acervo

  Cenário: Não gerar relatório de controle de acervo sem autenticação
    Dado que não possuo um token de acesso
    Quando tento uma requisição POST no controle de acervo
    Então não gera o controle de acervo retornando o status 401

  Cenário: Gerar relatório de controle de acervo autor
    Dado que possuo um token de acesso
    Quando envio uma requisição POST no controle de acervo autor
    Então gera o controle de acervo autor com status 200

  Cenário: Autor obrigatório ao gerar relatório de controle
    Dado que possuo um token de acesso
    Quando envio uma requisição POST no controle de acervo sem o autor
    Então autor é obrigatório ao gerar relatório de controle do acervo

  Cenário: Tipo obrigatório ao gerar relatório de controle de acervo autor
    Dado que possuo um token de acesso
    Quando envio uma requisição POST no controle de acervo autor sem tipo
    Então tipo é obrigatório ao gerar relatório de controle de acervo autor

  Cenário: Não gerar relatório de controle de acervo autor sem autenticação
    Dado que não possuo um token de acesso
    Quando tento uma requisição POST no controle de acervo autor
    Então não gera o controle de acervo autor retornando o status 401

  Cenário: Gerar relatório de controle de devolução de livros
    Dado que possuo um token de acesso
    Quando envio uma requisição POST no controle de livros
    Então gera o controle de devolução de livros com status 200

  Cenário: Gerar relatório de controle de livros sem solicitante
    Dado que possuo um token de acesso
    Quando envio uma requisição POST no controle de devolução de livros sem solicitante
    Então gera relatório de controle de livros sem solicitante

  Cenário: Campo de atraso obrigatório ao gerar relatório de controle de livros
    Dado que possuo um token de acesso
    Quando envio uma requisição POST no controle de acervo autor sem atraso
    Então campo de atraso obrigatório ao gerar relatório de controle de livros

  Cenário: Não gerar relatório de controle de livros sem autenticação
    Dado que não possuo um token de acesso
    Quando tento uma requisição POST no controle de livros
    Então não gera o controle de livros retornando o status 401

  Cenário: Gerar relatório de controle de editora
    Dado que possuo um token de acesso
    Quando envio uma requisição POST no controle de editora
    Então gera relatório de controle de editora com status 200

  Cenário: Editora obrigatória ao gerar relatório de controle
    Dado que possuo um token de acesso
    Quando envio uma requisição POST no controle sem editora
    Então editora obrigatória ao gerar relatório de controle

  Cenário: Não gerar relatório de controle de editora sem autenticação
    Dado que não possuo um token de acesso
    Quando tento uma requisição POST no controle de editora
    Então não gera o controle de editora retornando o status 401
    
  Cenário: Gerar relatório de controle de livros emprestados
    Dado que possuo um token de acesso
    Quando envio uma requisição POST no controle de emprestados
    Então gera relatório de controle de livros emprestados com status 200

  Cenário: Modelo é obrigatório ao gerar relatório de controle de emprestados
    Dado que possuo um token de acesso
    Quando envio uma requisição POST no controle de emprestados sem modelo
    Então não gera o controle de livros emprestados retornando o status 422

  Cenário: Não gerar relatório de controle de editora sem autenticação
    Dado que não possuo um token de acesso
    Quando tento uma requisição POST no controle de emprestados
    Então não gera o controle de livros emprestados retornando o status 401

  Cenário: Gerar relatório de títulos mais pesquisados
    Dado que possuo um token de acesso
    Quando envio uma requisição POST no controle de títulos
    Então gera relatório de títulos mais pesquisados com status 200

  Cenário: Período é obrigatório ao gerar relatório de títulos mais pesquisados
    Dado que possuo um token de acesso
    Quando envio uma requisição POST no controle de títulos sem período
    Então não gera de títulos mais pesquisados retornando o status 422

  Cenário: Não gerar relatório de títulos mais pesquisados sem autenticação
    Dado que não possuo um token de acesso
    Quando tento uma requisição POST no controle de títulos
    Então não gera o relatório de títulos mais pesquisados retornando o status 401

  Cenário: Gerar relatório de controle de download acervo
    Dado que possuo um token de acesso
    Quando envio uma requisição POST no controle de download
    Então gera relatório de download acervo com status 200

  Cenário: Não gerar relatório de controle de download acervo sem autenticação
    Dado que não possuo um token de acesso
    Quando tento uma requisição POST no controle de download
    Então não gera o relatório de download acervo retornando o status 401

  Cenário: Gerar relatório de histórico de solicitações acervo
    Dado que possuo um token de acesso
    Quando envio uma requisição POST no relatório de histórico acervo
    Então gera relatório de histórico de solicitações acervo com status 200

  Cenário: Não gerar histórico de solicitações acervo sem período
    Dado que possuo um token de acesso
    Quando envio uma requisição POST no relatório de histórico acervo sem período
    Então não gera relatório de histórico de solicitações acervo com status 422

  Cenário: Não gerar histórico de solicitações acervo sem autenticação
    Dado que não possuo um token de acesso
    Quando tento uma requisição POST no relatório de histórico acervo
    Então não gera o relatório de histórico de solicitações acervo retornando o status 401