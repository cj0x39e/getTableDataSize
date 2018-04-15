import getTextWidth from './getTextWidth';
import defaultOptions from './defaultOptions';


function getTableDataSize(columns, data, options = {}) {

    if (!Array.isArray(columns)) { throw Error('columns 参数错误!'); }

    if (!Array.isArray(data)) { throw Error('data 参数错误!'); }

    if (typeof options !== 'object') { options = {}; }

    const { labelAlias, fieldAlias, widthAlias, frozenAlias, columnMaxWidth } =
        Object.assign(Object.assign({}, defaultOptions), options);

    let font = options.font;
    if (typeof options.font !== 'string') {
        if (!getTableDataSize.font) {
            getTableDataSize.font = window.getComputedStyle(document.body,null).getPropertyValue('font');
        }
        font = getTableDataSize.font;
    }

    const columnLength = columns.length;
    const dataLength = data.length;
    let frozenCountWidth = 0;
    let unfrozenCountWidth = 0;

    for (let i = 0; i < columnLength; i++) {

        const column = columns[i];
        const rowField = column[fieldAlias];
        let columnWidth = getTextWidth(column[labelAlias], font);

        for (let j = 0; j < dataLength; j++) {
            columnWidth = Math.max(columnWidth, getTextWidth(data[j][rowField], font));
        }

        if (typeof column[widthAlias] !== 'number') { column[widthAlias] = Math.min(columnWidth, columnMaxWidth); }

        column[frozenAlias] ? frozenCountWidth += column[widthAlias] : unfrozenCountWidth += column[widthAlias];
    }

    let countWidth = frozenCountWidth + unfrozenCountWidth;

    return { countWidth, unfrozenCountWidth, frozenCountWidth };
}


export default getTableDataSize;
