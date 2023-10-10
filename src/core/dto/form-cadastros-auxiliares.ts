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
  title?: string;
  maxLength?: number;
  initialValues?: any;
  isModal?: boolean;
  setOpenModal?: (open: boolean, updateData?: boolean) => void;
};
