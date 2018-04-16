import getTextWidth from './getTextWidth';
import defaultOptions from './defaultOptions';

const widthFlag = '_widthFromGTDS_';

function getTableDataSize(columns, data, options = {}) {
    
    if (!Array.isArray(columns)) { throw Error('columns 参数错误!'); }
    
    if (!Array.isArray(data)) { throw Error('data 参数错误!'); }
    
    if (typeof options !== 'object') { options = {}; }
    
    const { labelAlias, fieldAlias, widthAlias, frozenAlias, columnMaxWidth, columnRedundancyWidth } =
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
    let frozenWidth = 0;
    let unfrozenWidth = 0;
    let calculateColumnAmount = 0;
    let notCalculateColumnAmount = 0;
    
    for (let i = 0; i < columnLength; i++) {
        
        const column = columns[i];
        const rowField = column[fieldAlias];
        let columnWidth = getTextWidth(column[labelAlias], font);
        
        for (let j = 0; j < dataLength; j++) {
            columnWidth = Math.max(columnWidth, getTextWidth(data[j][rowField], font));
        }
        
        columnWidth = columnWidth + columnRedundancyWidth;
        
        if (typeof column[widthAlias] !== 'number') {
            column[widthAlias] = Math.min(columnWidth, columnMaxWidth);
            column[widthFlag] = true;
            calculateColumnAmount++;
        } else {
            column[widthFlag] = false;
            notCalculateColumnAmount++;
        }
        
        column[frozenAlias] ? frozenWidth += column[widthAlias] : unfrozenWidth += column[widthAlias];
    }
    
    let totalWidth = frozenWidth + unfrozenWidth;
    
    return {
        totalWidth,
        unfrozenWidth,
        frozenWidth,
        calculateColumnAmount,
        notCalculateColumnAmount
    };
}


export default getTableDataSize;
