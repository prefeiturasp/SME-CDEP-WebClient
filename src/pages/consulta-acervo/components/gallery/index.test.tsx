import { render, screen } from '@testing-library/react';
import { ImageGalleryDetalhesAcervo } from './index';

jest.mock('react-image-gallery', () => {
  const MockGallery = (props: {
    items: Array<{ original: string; thumbnail?: string }>;
    showFullscreenButton: boolean;
    showThumbnails: boolean;
  }) => (
    <div
      data-testid='mock-gallery'
      data-fullscreen={String(props.showFullscreenButton)}
      data-thumbnails={String(props.showThumbnails)}
      data-items={JSON.stringify(props.items)}
    />
  );
  return MockGallery;
});

describe('ImageGalleryDetalhesAcervo', () => {
  it('C05: usa imagem padrão quando lista de imagens está vazia ou indefinida', () => {
    render(<ImageGalleryDetalhesAcervo enderecoImagemPadrao='https://exemplo.com/padrao.png' />);

    const gallery = screen.getByTestId('mock-gallery');
    expect(gallery).toHaveAttribute('data-fullscreen', 'false');
    expect(gallery).toHaveAttribute('data-thumbnails', 'false');
    expect(gallery).toHaveAttribute(
      'data-items',
      JSON.stringify([
        {
          original: 'https://exemplo.com/padrao.png',
          thumbnail: 'https://exemplo.com/padrao.png',
        },
      ]),
    );
  });

  it('C06: renderiza galeria completa quando imagens são fornecidas', () => {
    const imagens = [
      { original: 'https://exemplo.com/1.png', thumbnail: 'https://exemplo.com/1-t.png' },
    ];

    render(
      <ImageGalleryDetalhesAcervo
        imagens={imagens}
        enderecoImagemPadrao='https://exemplo.com/padrao.png'
      />,
    );

    const gallery = screen.getByTestId('mock-gallery');
    expect(gallery).toHaveAttribute('data-fullscreen', 'true');
    expect(gallery).toHaveAttribute('data-thumbnails', 'true');
    expect(gallery).toHaveAttribute('data-items', JSON.stringify(imagens));
  });
});
