import getTextWidth from './getTextWidth';
import defaultOptions from './defaultOptions';

const widthFlag = '_widthFromGTDS_';

const isNumber = num => typeof num === 'number';
const isString = str => typeof str === 'string';
const isObjectObject = obj => Object.prototype.toString.call(obj) === '[object Object]';

let defaultFont;
function getDefaultFont() {
    const font = defaultFont || (defaultFont = window.getComputedStyle(document.body, null).getPropertyValue('font'));

    return font;
}

function getTableDataSize(columns, data, options) {
    if (!Array.isArray(columns)) { throw Error('The parameter columns must be an array!'); }

    if (!Array.isArray(data)) { throw Error('The parameter data must be an array!'); }

    let userOptions;
    if (isObjectObject(options)) {
        userOptions = {};

        Object.keys(defaultOptions).forEach((key) => {
            const defaultValue = defaultOptions[key];
            const userValue = options[key];

            if (isNumber(defaultValue)) {
                userOptions[key] = isNumber(userValue) ? userValue : defaultValue;
            } else if (isString(defaultValue)) {
                userOptions[key] = isString(userValue) ? userValue : defaultValue;

                // font default value is null
            } else if (key === 'font') {
                userOptions[key] = isString(userValue)
                    ? userValue
                    : getDefaultFont();
            }
        });
    } else {
        userOptions = Object.assign({}, defaultOptions);

        userOptions.font = getDefaultFont();
    }

    const {
        labelAlias,
        fieldAlias,
        widthAlias,
        frozenAlias,
        columnMaxWidth,
        columnRedundancyWidth,
        font,
    } = userOptions;

    const columnLength = columns.length;
    const dataLength = data.length;
    let frozenWidth = 0;
    let unfrozenWidth = 0;
    let calculateColumnAmount = 0;
    let notCalculateColumnAmount = 0;

    for (let i = 0; i < columnLength; i += 1) {
        const column = columns[i];
        const rowField = column[fieldAlias];
        const fieldValid = isString(rowField);
        let columnWidth = getTextWidth(column[labelAlias], font);

        for (let j = 0; j < dataLength && fieldValid; j += 1) {
            columnWidth = Math.max(columnWidth, getTextWidth(data[j][rowField], font));
        }

        columnWidth += columnRedundancyWidth;

        if (isNumber(column[widthAlias])) {
            column[widthFlag] = false;
            notCalculateColumnAmount += 1;
        } else {
            column[widthAlias] = Math.min(columnWidth, columnMaxWidth);
            column[widthFlag] = true;
            calculateColumnAmount += 1;
        }

        if (column[frozenAlias]) {
            frozenWidth += column[widthAlias];
        } else {
            unfrozenWidth += column[widthAlias];
        }
    }

    const totalWidth = frozenWidth + unfrozenWidth;

    return {
        totalWidth,
        unfrozenWidth,
        frozenWidth,
        calculateColumnAmount,
        notCalculateColumnAmount,
    };
}


export default getTableDataSize;
