export as namespace getTableDataSize;

export interface Options {
    columnMaxWidth?: number;
    columnRedundancyWidth?: number;
    font?: string;
    widthAlias?: string;
    labelAlias?: string;
    fieldAlias?: string;
    frozenAlias?: string;
}

export interface Result {
    totalWidth: number;
    unfrozenWidth: number;
    frozenWidth: number;
    calculateColumnAmount: number;
    notCalculateColumnAmount: number;
}

export function getTableDataSize(columns: any[], data: any[], options?: Options): Result;

