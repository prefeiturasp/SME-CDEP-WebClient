import {
  TipoAcervo,
  TipoAcervoDisplay,
  TipoAcervoSuffix,
  TipoAcervoPlanilhaModelo,
} from './tipo-acervo';

describe('TipoAcervo Enum', () => {
  test('deve ter valor Bibliografico igual a 1', () => {
    expect(TipoAcervo.Bibliografico).toBe(1);
  });

  test('deve ter valor DocumentacaoTextual igual a 2', () => {
    expect(TipoAcervo.DocumentacaoTextual).toBe(2);
  });

  test('deve ter valor ArtesGraficas igual a 3', () => {
    expect(TipoAcervo.ArtesGraficas).toBe(3);
  });

  test('deve ter valor Audiovisual igual a 4', () => {
    expect(TipoAcervo.Audiovisual).toBe(4);
  });

  test('deve ter valor Fotografico igual a 5', () => {
    expect(TipoAcervo.Fotografico).toBe(5);
  });

  test('deve ter valor Tridimensional igual a 6', () => {
    expect(TipoAcervo.Tridimensional).toBe(6);
  });
});

describe('TipoAcervoDisplay', () => {
  test('deve ter label para Bibliografico', () => {
    expect(TipoAcervoDisplay[TipoAcervo.Bibliografico]).toBe('Bibliográfico');
  });

  test('deve ter label para DocumentacaoTextual', () => {
    expect(TipoAcervoDisplay[TipoAcervo.DocumentacaoTextual]).toBe('Documentação histórica');
  });

  test('deve ter label para ArtesGraficas', () => {
    expect(TipoAcervoDisplay[TipoAcervo.ArtesGraficas]).toBe('Artes gráficas');
  });

  test('deve ter label para Audiovisual', () => {
    expect(TipoAcervoDisplay[TipoAcervo.Audiovisual]).toBe('Audiovisual');
  });

  test('deve ter label para Fotografico', () => {
    expect(TipoAcervoDisplay[TipoAcervo.Fotografico]).toBe('Fotográfico');
  });

  test('deve ter label para Tridimensional', () => {
    expect(TipoAcervoDisplay[TipoAcervo.Tridimensional]).toBe('Tridimensional');
  });
});

describe('TipoAcervoSuffix', () => {
  test('Bibliografico deve ter sufixo vazio', () => {
    expect(TipoAcervoSuffix[TipoAcervo.Bibliografico]).toBe('');
  });

  test('DocumentacaoTextual deve ter sufixo vazio', () => {
    expect(TipoAcervoSuffix[TipoAcervo.DocumentacaoTextual]).toBe('');
  });

  test('ArtesGraficas deve ter sufixo .AG', () => {
    expect(TipoAcervoSuffix[TipoAcervo.ArtesGraficas]).toBe('.AG');
  });

  test('Audiovisual deve ter sufixo .AV', () => {
    expect(TipoAcervoSuffix[TipoAcervo.Audiovisual]).toBe('.AV');
  });

  test('Fotografico deve ter sufixo .FT', () => {
    expect(TipoAcervoSuffix[TipoAcervo.Fotografico]).toBe('.FT');
  });

  test('Tridimensional deve ter sufixo .TD', () => {
    expect(TipoAcervoSuffix[TipoAcervo.Tridimensional]).toBe('.TD');
  });
});

describe('TipoAcervoPlanilhaModelo', () => {
  test('Bibliografico deve ter planilha modelo correta', () => {
    expect(TipoAcervoPlanilhaModelo[TipoAcervo.Bibliografico]).toBe(
      'planilha_acervo_bibliografico.xlsx',
    );
  });

  test('DocumentacaoTextual deve ter planilha modelo correta', () => {
    expect(TipoAcervoPlanilhaModelo[TipoAcervo.DocumentacaoTextual]).toBe(
      'planilha_acervo_documental.xlsx',
    );
  });

  test('ArtesGraficas deve ter planilha modelo correta', () => {
    expect(TipoAcervoPlanilhaModelo[TipoAcervo.ArtesGraficas]).toBe(
      'planilha_acervo_arte_grafica.xlsx',
    );
  });

  test('Audiovisual deve ter planilha modelo correta', () => {
    expect(TipoAcervoPlanilhaModelo[TipoAcervo.Audiovisual]).toBe(
      'planilha_acervo_audiovisual.xlsx',
    );
  });

  test('Fotografico deve ter planilha modelo correta', () => {
    expect(TipoAcervoPlanilhaModelo[TipoAcervo.Fotografico]).toBe(
      'planilha_acervo_fotografico.xlsx',
    );
  });

  test('Tridimensional deve ter planilha modelo correta', () => {
    expect(TipoAcervoPlanilhaModelo[TipoAcervo.Tridimensional]).toBe(
      'planilha_acervo_tridimensional.xlsx',
    );
  });
});
