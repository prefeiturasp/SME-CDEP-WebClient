type FormPageInputsCadastrosAuxiliaresProps = {
  name: string;
  placeholder: string;
};

type FormPageCadastrosAuxiliaresProps = {
  title: string;
  urlBase: string;
  inputs: FormPageInputsCadastrosAuxiliaresProps[];
  urlMainPage: string;
};

export type FormCadastrosAuxiliaresProps = {
  page: FormPageCadastrosAuxiliaresProps;
  initialValues?: any;
  isModal?: boolean;
  setOpenModal?: (open: boolean, updateData?: boolean) => void;
};
