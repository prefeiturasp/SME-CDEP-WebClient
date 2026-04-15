class Meus_Dados_Localizadores {

  // consulta
  submenu_meus_dados = () => '.ant-menu-submenu-title'
  item_menu_meus_dados = () => 'li.ant-menu-item .ant-menu-title-content'
  input_email = () => '#CDEP_INPUT_EMAIL'
  input_senha = () => '#CDEP_INPUT_SENHA' 

  // editar
  btn_alterar_email = () => ':nth-child(1) > .ant-row-no-wrap > .ant-btn'
  btn_alterar_senha = () => ':nth-child(2) > .ant-row-no-wrap > .ant-btn'   
  btn_modal_alterar = () => '#CDEP_BUTTON_MODAL_ALTERAR'
  btn_modal_cancelar = () => '#CDEP_BUTTON_MODAL_CANCELAR > span'  
  input_senha_atual = () => '#CDEP_INPUT_SENHA_ATUAL'
  input_nova_senha = () => ':nth-child(2) > .ant-form-item > .ant-row > .ant-form-item-control > .ant-form-item-control-input > .ant-form-item-control-input-content > .ant-input-affix-wrapper > #CDEP_INPUT_SENHA'
  input_confirmacao_senha = () => '#CDEP_INPUT_CONFIRMAR_SENHA'
  msgm_alteracao_sucesso = () => '.ant-modal-body'  

}

export default Meus_Dados_Localizadores 