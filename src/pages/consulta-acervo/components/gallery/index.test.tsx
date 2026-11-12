import { render, screen } from '~/tests/test-utils';
import { ImageGalleryDetalhesAcervo } from './index';
import ReactImageGallery, { ReactImageGalleryItem } from 'react-image-gallery';

jest.mock('react-image-gallery', () => {
  return jest.fn((props) => (
    <div
      data-testid='mock-react-image-gallery'
      className='image-gallery'
      data-items-count={props.items?.length}
    />
  ));
});

describe('ImageGalleryDetalhesAcervo', () => {
  const enderecoImagemPadrao = 'https://exemplo.com/imagem-padrao.jpg';

  const mockImagens: ReactImageGalleryItem[] = [
    {
      original: 'https://exemplo.com/foto1.jpg',
      thumbnail: 'https://exemplo.com/thumb1.jpg',
    },
    {
      original: 'https://exemplo.com/foto2.jpg',
      thumbnail: 'https://exemplo.com/thumb2.jpg',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Quando não há imagens (fallback para imagem padrão)', () => {
    test('utiliza a imagem padrão quando imagens for undefined', () => {
      const { container } = render(
        <ImageGalleryDetalhesAcervo enderecoImagemPadrao={enderecoImagemPadrao} />,
      );

      expect(screen.getByTestId('mock-react-image-gallery')).toBeInTheDocument();

      expect(ReactImageGallery).toHaveBeenCalledWith(
        expect.objectContaining({
          items: [
            {
              original: enderecoImagemPadrao,
              thumbnail: enderecoImagemPadrao,
            },
          ],
          autoPlay: false,
          showBullets: false,
          showPlayButton: false,
          showFullscreenButton: false,
          showThumbnails: false,
        }),
        {},
      );

      const styles = Array.from(document.querySelectorAll('style'))
        .map((s) => s.innerHTML)
        .join(' ');
      expect(styles).toContain('width:200px!important;');
      expect(container.firstChild).toHaveStyle({
        display: 'flex',
        alignItems: 'center',
      });
    });

    test('utiliza a imagem padrão quando imagens for um array vazio', () => {
      render(
        <ImageGalleryDetalhesAcervo imagens={[]} enderecoImagemPadrao={enderecoImagemPadrao} />,
      );

      expect(ReactImageGallery).toHaveBeenCalledWith(
        expect.objectContaining({
          items: [
            {
              original: enderecoImagemPadrao,
              thumbnail: enderecoImagemPadrao,
            },
          ],
          showFullscreenButton: false,
          showThumbnails: false,
        }),
        {},
      );

      const styles = Array.from(document.querySelectorAll('style'))
        .map((s) => s.innerHTML)
        .join(' ');
      expect(styles).toContain('width:200px!important;');
    });
  });

  describe('Quando imagens são fornecidas', () => {
    test('repassa a lista de imagens e ativa fullscreen e thumbnails', () => {
      const { container } = render(
        <ImageGalleryDetalhesAcervo
          imagens={mockImagens}
          enderecoImagemPadrao={enderecoImagemPadrao}
        />,
      );

      expect(screen.getByTestId('mock-react-image-gallery')).toBeInTheDocument();

      expect(ReactImageGallery).toHaveBeenCalledWith(
        expect.objectContaining({
          items: mockImagens,
          autoPlay: false,
          showBullets: false,
          showPlayButton: false,
          showFullscreenButton: true,
          showThumbnails: true,
        }),
        {},
      );

      const styles = Array.from(document.querySelectorAll('style'))
        .map((s) => s.innerHTML)
        .join(' ');
      expect(styles).toContain('width:400px!important;');
      expect(container.firstChild).toHaveStyle({
        display: 'flex',
        alignItems: 'center',
      });
    });
  });
});
