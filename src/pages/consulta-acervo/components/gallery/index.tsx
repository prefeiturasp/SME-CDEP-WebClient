import React from 'react';
import ReactImageGallery, { ReactImageGalleryItem } from 'react-image-gallery';
import styled from 'styled-components';

type ImageGalleryContainerProps = {
  temImagens: boolean;
};
const ImageGalleryContainer = styled.div<ImageGalleryContainerProps>`
  .image-gallery {
    width: ${(props) => (props.temImagens ? '400px' : '200px')}!important;
  }
  display: flex;
  align-items: center;
`;

type ImageGalleryDetalhesAcervoProps = {
  imagens?: ReactImageGalleryItem[];
  enderecoImagemPadrao: string;
};
export const ImageGalleryDetalhesAcervo: React.FC<ImageGalleryDetalhesAcervoProps> = ({
  imagens,
  enderecoImagemPadrao,
}) => {
  const temImagens = !!imagens?.length;

  const items: ReactImageGalleryItem[] = temImagens
    ? imagens
    : [
        {
          original: enderecoImagemPadrao,
          thumbnail: enderecoImagemPadrao,
        },
      ];
  return (
    <ImageGalleryContainer temImagens={temImagens}>
      <ReactImageGallery
        items={items}
        autoPlay={false}
        showBullets={false}
        showPlayButton={false}
        showFullscreenButton={temImagens}
        showThumbnails={temImagens}
      />
    </ImageGalleryContainer>
  );
};
