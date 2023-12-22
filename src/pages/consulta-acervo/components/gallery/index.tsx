import React from 'react';
import ReactImageGallery, { ReactImageGalleryItem } from 'react-image-gallery';
import styled from 'styled-components';
import cdepLogoFundoBiblioteca from '~/assets/cdep-fundo-login.svg';

const ImageGalleryContainer = styled.div`
  .image-gallery {
    width: 400px !important;
  }
`;

type ImageGalleryDetalhesAcervoProps = {
  imagens?: ReactImageGalleryItem[];
};
export const ImageGalleryDetalhesAcervo: React.FC<ImageGalleryDetalhesAcervoProps> = ({
  imagens,
}) => {
  const items: ReactImageGalleryItem[] = imagens?.length
    ? imagens
    : [
        {
          original: cdepLogoFundoBiblioteca,
          thumbnail: cdepLogoFundoBiblioteca,
        },
      ];
  return (
    <ImageGalleryContainer>
      <ReactImageGallery
        items={items}
        autoPlay={false}
        showBullets={false}
        showPlayButton={false}
      />
    </ImageGalleryContainer>
  );
};
