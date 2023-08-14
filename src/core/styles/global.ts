import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`

  body {
    margin: 0;
  }

  .ant-modal .ant-modal-content{
    padding: 16px;
    border-radius: 4px;
  }

  .ant-modal-confirm .ant-modal-confirm-body .ant-modal-confirm-title {
    font-size: 18px;
  }
  .ant-modal-confirm .ant-modal-confirm-body .ant-modal-confirm-title +.ant-modal-confirm-content {
    font-size: 15px;
  }

  .ant-btn{
    padding: 0 15px
  }
`;
