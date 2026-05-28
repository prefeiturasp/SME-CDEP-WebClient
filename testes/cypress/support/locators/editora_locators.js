class Editora_Localizadores {

  // criar
  menu_editora = () => 'span.ant-menu-title-content:contains("Editora")'
  btn_novo = () => '#CDEP_BUTTON_NOVO'
  btn_cancelar = () => '#CDEP_BUTTON_CANCELAR'
  btn_confimar_modal = () => '.ant-modal-confirm-btns > .ant-btn-default'
  input_titulo = () => '#CDEP_INPUT_NOVO'
  btn_salvar = () => '#CDEP_BUTTON_NOVO > span'
  msg_sucesso = () => 'div.ant-notification-notice-description'

  // consultar
  input_nome = () => 'input[placeholder="Nome"]'
  tbl_nome_editora = () => '.ant-table-cell'
  btn_voltar = () => '#CDEP_BUTTON_VOLTAR'
  tbl_linhas = () => '.ant-table-tbody tr'
  tbl_celulas = () => 'td'

  // editar 
  msg_campo_obrigatorio = () => 'div.ant-form-item-explain-error'

  // excluir
  btn_excluir = () => '#CDEP_BUTTON_EXCLUIR'
  btn_cancelar_exclusao = () => '.ant-modal-confirm-btns > .ant-btn-text'

}

export default Editora_Localizadores 