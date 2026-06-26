# language: pt

Funcionalidade: Consulta de Relatórios

  Contexto:
    Dado eu acesso o sistema com a visualização "web"
    E realizo login no sistema CDEP com perfil "Admin"    

  Esquema do Cenário: Validar dados encontrados: <caso>
    E acesso a tela relatórios "<caso>"
    Quando seleciono o tipo analítico em livros emprestados
    E clico em gerar relatório
    Então o sistema realiza o download do relatório "<caso>"

    Exemplos:
      | tipo    | caso                           |
      | acervo  | Controle de livros emprestados |

  Esquema do Cenário: Validar dados não encontrados: <caso>
    E acesso a tela relatórios "<caso>"
    Quando seleciono o tipo sintético em livros emprestados
    E clico em gerar relatório
    Então o sistema informa nenhum dado encontrado para download do relatório "<caso>"

    Exemplos:
      | tipo    | caso                           |
      | acervo  | Controle de livros emprestados |

  Esquema do Cenário: Validar campos obrigatórios: <caso>
    E acesso a tela relatórios "<caso>"
    Quando não seleciono o tipo em livros emprestados
    E tento clicar em gerar relatório
    Então o sistema não realiza o download do relatório "<caso>"

    Exemplos:
      | tipo    | caso                           |
      | acervo  | Controle de livros emprestados |
    
  Esquema do Cenário: Validar dados encontrados: <caso>
    E acesso a tela relatórios "<caso>"
    Quando seleciono o tipo acervo em tombo
    E a situação do tombo
    E clico em gerar relatório
    Então o sistema realiza o download do relatório "<caso>"

    Exemplos:
      | tipo    | caso                     |
      | acervo  | Controle de tombo/código |

  Esquema do Cenário: Validar dados não encontrados: <caso>
    E acesso a tela relatórios "<caso>"
    Quando seleciono o tipo acervo em tombo
    E a situação do tombo
    E clico em gerar relatório
    Então o sistema informa nenhum dado encontrado para download do relatório "<caso>"

    Exemplos:
      | tipo    | caso                     |
      | acervo  | Controle de tombo/código |

  Esquema do Cenário: Validar campos obrigatórios: <caso>
    E acesso a tela relatórios "<caso>"
    Quando não seleciono o tipo em tombo
    E tento clicar em gerar relatório
    Então o sistema não realiza o download do relatório "<caso>"

    Exemplos:
      | tipo    | caso                     |
      | acervo  | Controle de tombo/código |

  Esquema do Cenário: Validar dados encontrados: <caso>
    E acesso a tela relatórios "<caso>"
    Quando seleciono o crédito e autoria
    E clico em gerar relatório
    Então o sistema realiza o download do relatório "<caso>"

    Exemplos:
      | tipo    | caso                       |
      | acervo  | Controle por autor/crédito |

  Esquema do Cenário: Validar dados não encontrados: <caso>
    E acesso a tela relatórios "<caso>"
    Quando seleciono o crédito e autoria
    E clico em gerar relatório
    Então o sistema informa nenhum dado encontrado para download do relatório "<caso>"

    Exemplos:
      | tipo    | caso                       |
      | acervo  | Controle por autor/crédito |

  Esquema do Cenário: Validar filtros no: <caso>
    E acesso a tela relatórios "<caso>"
    Quando seleciono o crédito e autoria
    E clico em gerar relatório
    Então o sistema realiza o download do relatório "<caso>"

    Exemplos:
      | tipo    | caso                       |
      | acervo  | Controle por autor/crédito |

  Esquema do Cenário: Validar dados encontrados: <caso>
    E acesso a tela relatórios "<caso>"
    Quando não seleciono editora no campo
    E clico em gerar relatório
    Então o sistema realiza o download do relatório "<caso>"

    Exemplos:
      | tipo    | caso                 |
      | acervo  | Controle por editora |

  Esquema do Cenário: Validar dados não encontrados: <caso>
    E acesso a tela relatórios "<caso>"
    Quando seleciono a editora no campo
    E clico em gerar relatório
    Então o sistema informa nenhum dado encontrado para download do relatório "<caso>"

    Exemplos:
      | tipo    | caso                 |
      | acervo  | Controle por editora |

  Esquema do Cenário: Validar filtros no: <caso>
    E acesso a tela relatórios "<caso>"
    Quando seleciono a editora no campo
    E clico em gerar relatório
    Então o sistema realiza o download do relatório "<caso>"

    Exemplos:
      | tipo    | caso                 |
      | acervo  | Controle por editora |
 
  Esquema do Cenário: Validar dados encontrados: <caso>
    E acesso a tela relatórios "<caso>"
    Quando não seleciono filtros na devolução
    E clico em gerar relatório
    Então o sistema realiza o download do relatório "<caso>"

    Exemplos:
      | tipo    | caso                            |
      | acervo  | Controle de devolução de livros |

  Esquema do Cenário: Validar dados não encontrados: <caso>
    E acesso a tela relatórios "<caso>"
    Quando não seleciono filtros na devolução
    E clico em gerar relatório
    Então o sistema informa nenhum dado encontrado para download do relatório "<caso>"

    Exemplos:
      | tipo    | caso                            |
      | acervo  | Controle de devolução de livros |

  Esquema do Cenário: Validar filtros no: <caso>
    E acesso a tela relatórios "<caso>"
    Quando seleciono filtros na devolução de livros
    E clico em gerar relatório
    Então o sistema realiza o download do relatório "<caso>"

    Exemplos: 
      | tipo    | caso                            |
      | acervo  | Controle de devolução de livros |

  Esquema do Cenário: Validar dados encontrados: <caso>
    E acesso a tela relatórios "<caso>"
    Quando não seleciono filtros no controle de download
    E clico em gerar relatório
    Então o sistema realiza o download do relatório "<caso>"

    Exemplos:
      | tipo    | caso                            |
      | acervo  | Controle de download de acervos |

  Esquema do Cenário: Validar dados não encontrados: <caso>
    E acesso a tela relatórios "<caso>"
    Quando não seleciono filtros no controle de download
    E clico em gerar relatório
    Então o sistema informa nenhum dado encontrado para download do relatório "<caso>"

    Exemplos:
      | tipo    | caso                            |
      | acervo  | Controle de download de acervos |

  Esquema do Cenário: Validar filtros no: <caso>
    E acesso a tela relatórios "<caso>"
    Quando seleciono filtros no controle de download
    E clico em gerar relatório
    Então o sistema realiza o download do relatório "<caso>"

    Exemplos: 
      | tipo    | caso                            |
      | acervo  | Controle de download de acervos |

  Esquema do Cenário: Validar dados encontrados: <caso>
    E acesso a tela relatórios "<caso>"
    Quando seleciono filtros no mais pesquisados
    E clico em gerar relatório
    Então o sistema realiza o download do relatório "<caso>"

    Exemplos:
      | tipo    | caso                     |
      | acervo  | Títulos mais pesquisados |

  Esquema do Cenário: Validar dados não encontrados: <caso>
    E acesso a tela relatórios "<caso>"
    Quando não seleciono filtros no mais pesquisados    
    Então o sistema não realiza o download do relatório "<caso>"

    Exemplos:
      | tipo    | caso                     |
      | acervo  | Títulos mais pesquisados |

  Esquema do Cenário: Validar filtros no: <caso>
    E acesso a tela relatórios "<caso>"
    Quando seleciono filtros no mais pesquisados
    E clico em gerar relatório
    Então o sistema realiza o download do relatório "<caso>"

    Exemplos: 
      | tipo    | caso                     |
      | acervo  | Títulos mais pesquisados |

  Esquema do Cenário: Validar dados encontrados: <caso>
    E acesso a tela relatórios "<caso>"
    Quando seleciono filtros no histórico das solicitações
    E clico em gerar relatório
    Então o sistema realiza o download do relatório "<caso>"

    Exemplos:
      | tipo    | caso                                   |
      | acervo  | Relatório de Histórico de Solicitações |

  Esquema do Cenário: Validar dados não encontrados: <caso>
    E acesso a tela relatórios "<caso>"
    Quando não seleciono filtros no histórico das solicitações 
    Então o sistema não realiza o download do relatório "<caso>"

    Exemplos:
      | tipo    | caso                                   |
      | acervo  | Relatório de Histórico de Solicitações |

  Esquema do Cenário: Validar filtros no: <caso>
    E acesso a tela relatórios "<caso>"
    Quando seleciono filtros no histórico das solicitações
    E clico em gerar relatório
    Então o sistema realiza o download do relatório "<caso>"

    Exemplos: 
      | tipo    | caso                                   |
      | acervo  | Relatório de Histórico de Solicitações |