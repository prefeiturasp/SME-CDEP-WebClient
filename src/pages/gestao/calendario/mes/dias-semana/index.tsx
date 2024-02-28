import { DiasSemanaEnum, DiasSemanaEnumEnumDisplay } from '~/core/enum/dias-semana';

export type DiasProps = {
  key: DiasSemanaEnum;
  label: string;
};

export const diasSemana: DiasProps[] = [
  {
    key: DiasSemanaEnum.Domingo,
    label: DiasSemanaEnumEnumDisplay[DiasSemanaEnum.Domingo],
  },
  {
    key: DiasSemanaEnum.Segunda,
    label: DiasSemanaEnumEnumDisplay[DiasSemanaEnum.Segunda],
  },
  {
    key: DiasSemanaEnum.Terça,
    label: DiasSemanaEnumEnumDisplay[DiasSemanaEnum.Terça],
  },
  {
    key: DiasSemanaEnum.Quarta,
    label: DiasSemanaEnumEnumDisplay[DiasSemanaEnum.Quarta],
  },
  {
    key: DiasSemanaEnum.Quinta,
    label: DiasSemanaEnumEnumDisplay[DiasSemanaEnum.Quinta],
  },
  {
    key: DiasSemanaEnum.Sexta,
    label: DiasSemanaEnumEnumDisplay[DiasSemanaEnum.Sexta],
  },
  {
    key: DiasSemanaEnum.Sabado,
    label: DiasSemanaEnumEnumDisplay[DiasSemanaEnum.Sabado],
  },
];
