import { render } from '@testing-library/react';
import React from 'react';
import { MesesEnum, MesesEnumEnumDisplay } from '~/core/enum/meses';
import { mesesCalendario } from './index';

describe('mesesCalendario', () => {
  it('deve conter exatamente 3 linhas na matriz de meses', () => {
    expect(mesesCalendario).toBeDefined();
    expect(mesesCalendario).toHaveLength(3);
  });

  it('deve conter 4 meses em cada uma das linhas totalizando 12 meses', () => {
    let totalMeses = 0;
    mesesCalendario.forEach((linha) => {
      expect(linha.row).toHaveLength(4);
      totalMeses += linha.row.length;
    });
    expect(totalMeses).toBe(12);
  });

  it('deve conter a primeira linha com Janeiro, Fevereiro, Março e Abril', () => {
    const primeiraLinha = mesesCalendario[0].row;
    expect(primeiraLinha[0].key).toBe(MesesEnum.Janeiro);
    expect(primeiraLinha[0].label).toBe(MesesEnumEnumDisplay[MesesEnum.Janeiro]);

    expect(primeiraLinha[1].key).toBe(MesesEnum.Fevereiro);
    expect(primeiraLinha[1].label).toBe(MesesEnumEnumDisplay[MesesEnum.Fevereiro]);

    expect(primeiraLinha[2].key).toBe(MesesEnum.Março);
    expect(primeiraLinha[2].label).toBe(MesesEnumEnumDisplay[MesesEnum.Março]);

    expect(primeiraLinha[3].key).toBe(MesesEnum.Abril);
    expect(primeiraLinha[3].label).toBe(MesesEnumEnumDisplay[MesesEnum.Abril]);
  });

  it('deve conter a segunda linha com Maio, Junho, Julho e Agosto', () => {
    const segundaLinha = mesesCalendario[1].row;
    expect(segundaLinha[0].key).toBe(MesesEnum.Maio);
    expect(segundaLinha[0].label).toBe(MesesEnumEnumDisplay[MesesEnum.Maio]);

    expect(segundaLinha[1].key).toBe(MesesEnum.Junho);
    expect(segundaLinha[1].label).toBe(MesesEnumEnumDisplay[MesesEnum.Junho]);

    expect(segundaLinha[2].key).toBe(MesesEnum.Julho);
    expect(segundaLinha[2].label).toBe(MesesEnumEnumDisplay[MesesEnum.Julho]);

    expect(segundaLinha[3].key).toBe(MesesEnum.Agosto);
    expect(segundaLinha[3].label).toBe(MesesEnumEnumDisplay[MesesEnum.Agosto]);
  });

  it('deve conter a terceira linha com Setembro, Outubro, Novembro e Dezembro', () => {
    const terceiraLinha = mesesCalendario[2].row;
    expect(terceiraLinha[0].key).toBe(MesesEnum.Setembro);
    expect(terceiraLinha[0].label).toBe(MesesEnumEnumDisplay[MesesEnum.Setembro]);

    expect(terceiraLinha[1].key).toBe(MesesEnum.Outubro);
    expect(terceiraLinha[1].label).toBe(MesesEnumEnumDisplay[MesesEnum.Outubro]);

    expect(terceiraLinha[2].key).toBe(MesesEnum.Novembro);
    expect(terceiraLinha[2].label).toBe(MesesEnumEnumDisplay[MesesEnum.Novembro]);

    expect(terceiraLinha[3].key).toBe(MesesEnum.Dezembro);
    expect(terceiraLinha[3].label).toBe(MesesEnumEnumDisplay[MesesEnum.Dezembro]);
  });

  it('cada mês deve possuir key, label e o ícone extra válido', () => {
    const todasAsChaves: number[] = [];

    mesesCalendario.forEach((linha) => {
      linha.row.forEach((mes) => {
        expect(mes).toHaveProperty('key');
        expect(mes).toHaveProperty('label');
        expect(mes).toHaveProperty('extra');
        expect(typeof mes.key).toBe('number');
        expect(typeof mes.label).toBe('string');
        expect(mes.label.length).toBeGreaterThan(0);
        expect(React.isValidElement(mes.extra)).toBe(true);

        const { container } = render(<div>{mes.extra}</div>);
        expect(container.querySelector('svg')).toBeInTheDocument();

        todasAsChaves.push(mes.key);
      });
    });

    expect(todasAsChaves).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  });
});
