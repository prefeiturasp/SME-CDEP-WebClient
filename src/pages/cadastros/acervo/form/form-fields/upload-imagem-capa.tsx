import React, { useState } from 'react';
import { Form, FormItemProps, Upload, message } from 'antd';
import { PropsByFieldAcervoEnum, FieldAcervoEnum } from '~/core/enum/field-acervo-enum';
import type { UploadProps, RcFile } from 'antd/es/upload';
import { MdAddPhotoAlternate, MdClose } from 'react-icons/md';
import styles from './upload-imagem-capa.module.css';

interface UploadImagemCapaProps {
  onFileChange: (file: File | null) => void;
  formItemProps?: FormItemProps;
}

const MAX_FILE_SIZE_MB = 5;
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];

const getBase64 = (file: RcFile, callback: (result: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(file);
};
const fieldProps = PropsByFieldAcervoEnum[FieldAcervoEnum.ImagemCapa];
const UploadImagemCapa: React.FC<UploadImagemCapaProps> = ({ onFileChange, formItemProps }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  /**
   * @description Handles the file selection and validation logic before uploading.
   * @param {RcFile} file - The selected file.
   * @returns {boolean} Returns false to prevent automatic upload and handle it manually.
   */
  const beforeUpload = (file: RcFile): boolean => {
    const isFileTypeAllowed = ALLOWED_FILE_TYPES.includes(file.type);
    if (!isFileTypeAllowed) {
      message.error('Você só pode carregar imagens JPG/PNG!');
      return false;
    }

    const isLt5M = file.size / 1024 / 1024 < MAX_FILE_SIZE_MB;
    if (!isLt5M) {
      message.error(`A imagem deve ser menor que ${MAX_FILE_SIZE_MB}MB!`);
      return false;
    }
    
    // Convert to base64 for preview and update parent state
    getBase64(file, (url) => {
      console.log('Imagem convertida para base64:', url);
      setImageUrl(url);
    });
    onFileChange(file);

    // Prevent ant design's default upload behaviour
    return false;
  };

  /**
   * @description Removes the currently selected image.
   */
  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent triggering the upload
    setImageUrl(null);
    onFileChange(null);
  };
  
  const uploadButton = (
    <div className={styles.uploadButtonContainer}>
      <MdAddPhotoAlternate className={styles.uploadIcon} />
      <span>{fieldProps.label}</span>
    </div>
  );

  const props: UploadProps = {
    name: fieldProps.name,
    accept: ALLOWED_FILE_TYPES.join(','),
    showUploadList: false,
    beforeUpload: beforeUpload,
    maxCount: 1,
  };

  return (
    <Form.Item
      name={fieldProps.name}
      {...formItemProps}
    >
    <div className={styles.container}>
      <Upload {...props}>
        {imageUrl ? (
          <div className={styles.imagePreviewWrapper}>
            <img src={imageUrl} alt="Prévia da Capa" className={styles.imagePreview} />
            <button onClick={handleRemoveImage} className={styles.removeButton}>
              <MdClose />
            </button>
          </div>
        ) : (
          uploadButton
        )}
      </Upload>
    </div>
    </Form.Item>
  );
};

export default UploadImagemCapa;