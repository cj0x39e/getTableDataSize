import { getTableDataSize } from '../index.js';
import { expect } from 'chai';
import { columns, data } from './data';


const copyColumns = () => JSON.parse(JSON.stringify(columns));

describe('getTableDataSize 参数及返回值测试', function() {
    let result;

    before(function() {
        result = getTableDataSize(copyColumns(), data);
    });

    it('columns 参数不是数组应该抛出错误', function() {
        expect(getTableDataSize).to.throw(/columns/);
        expect(() => getTableDataSize(null)).to.throw(/columns/);
        expect(() => getTableDataSize('')).to.throw(/columns/);
        expect(() => getTableDataSize({})).to.throw(/columns/);
        expect(() => getTableDataSize(1)).to.throw(/columns/);
        expect(() => getTableDataSize(true)).to.throw(/columns/);
    });

    it('如果 columns 某一个列的配置未定义 field 相关信息，程序正常运行', function () {
        const columns = [
            { label: '1', field: 'name' },
            { label: '2', }
        ];
        const data = [
            { name: '张三' },
            { name: '李四' }
        ];

        expect(() => getTableDataSize(columns, data)).to.not.throw();
    });

    it('data 参数不是数组应该抛出错误', function() {
        expect(() => getTableDataSize([], null)).to.throw(/data/);
        expect(() => getTableDataSize([], '')).to.throw(/data/);
        expect(() => getTableDataSize([], {})).to.throw(/data/);
        expect(() => getTableDataSize([], 1)).to.throw(/data/);
        expect(() => getTableDataSize([], true)).to.throw(/data/);
    });

    it('options 参数不是对象应该能正常运行', function () {
        expect(() => getTableDataSize(copyColumns(), data, null)).to.not.throw();
        expect(() => getTableDataSize(copyColumns(), data, '')).to.not.throw();
        expect(() => getTableDataSize(copyColumns(), data, [])).to.not.throw();
        expect(() => getTableDataSize(copyColumns(), data, 1)).to.not.throw();
        expect(() => getTableDataSize(copyColumns(), data, true)).to.not.throw();
        expect(() => getTableDataSize(copyColumns(), data, () => {})).to.not.throw();
    });

    it('返回值应该包含 totalWidth、unfrozenWidth、frozenWidth、calculateColumnAmount、notCalculateColumnAmount，且都为数值', function () {
        expect(result.totalWidth).to.be.an('number');
        expect(result.unfrozenWidth).to.be.an('number');
        expect(result.frozenWidth).to.be.an('number');
        expect(result.calculateColumnAmount).to.be.an('number');
        expect(result.notCalculateColumnAmount).to.be.an('number');
    });

    it('返回值 totalWidth 为 unfrozenWidth 和 frozenWidth 之和', function () {
        expect(result.unfrozenWidth + result.frozenWidth).to.be.equal(result.totalWidth);
    });

    it('返回值 calculateColumnAmount 与 notCalculateColumnAmount 之和为 columns.length', function () {
        expect(result.calculateColumnAmount + result.notCalculateColumnAmount).to.be.equal(columns.length);
    });

    it('如果 columns 里有某一列用户配置了宽度，则 notCalculateColumnAmount 为 1, calculateColumnAmount 为 columns.length - 1', function () {
        const columns = copyColumns();
        columns[0].width = 100;

        const rs = getTableDataSize(columns, data);

        expect(rs.calculateColumnAmount).to.be.equal(columns.length - 1);
        expect(rs.notCalculateColumnAmount).to.be.equal(1);
    });
});

describe('getTableDataSize 配置测试', function() {

    it('配置 columnMaxWidth 后，每列宽度不能超过该值', function () {
        const columns = copyColumns();
        getTableDataSize(columns, data, { columnMaxWidth: 1 });

        expect(columns.every(c => c.width <= 1)).to.equal(true);
    });

    it('配置 columnRedundancyWidth 后，对比相同的数据未配置时，计算结果每列宽度应增加该宽度', function () {
        const columns = copyColumns();
        const columns2 = copyColumns();


        getTableDataSize(columns, data, { columnRedundancyWidth: 1 });
        getTableDataSize(columns2, data);

        const rs = columns.every((c, i) => c.width - columns2[i].width === 1);

        expect(rs).to.equal(true);
    });

    it('配置一个较大的 font 值，计算结果与默认配置应该有所不同', function () {
        const columns = copyColumns();
        const columns2 = copyColumns();


        getTableDataSize(columns, data, { font: 'small-caps bold 44px/1 sans-serif' });
        getTableDataSize(columns2, data);

        const rs = columns.every((c, i) => c.width !== columns2[i].width);

        expect(rs).to.equal(true);
    });

    it('配置 widthAlias 后，所有列的 widthAlias 字段值有值且之和等于 totalWidth', function () {
        const columns = copyColumns();
        const widthAlias = 'myWidth';
        const result = getTableDataSize(columns, data, { widthAlias: widthAlias });
        const sum = columns.reduce((r, c) => r + c[widthAlias], 0);
        expect(sum).to.equal(result.totalWidth);
    });

    it('配置 labelAlias 后，对于相同的 data, 给定两个不同 `labelAlias` 的 columns 的配置' +
        '并设置 columns 的 `labelAlias` 的内容大于每行该列的内容，最后两份配置得出的 totalWidth 一定相等', function () {
        const columns = copyColumns();
        const columns2 = copyColumns();
        const labelAlias = 'myLabel';
        const labelAlias2 = 'myLabel2';
        columns.map(c => { c[labelAlias] = '测试 labelAlias 我是较长的标题'; delete c.label; return c;});
        columns2.map(c => { c[labelAlias2] = '测试 labelAlias 我是较长的标题'; delete c.label; return c;});
        const result = getTableDataSize(columns, data, { labelAlias: labelAlias });
        const result2 = getTableDataSize(columns, data, { labelAlias: labelAlias2 });

        expect(result.totalWidth === result2.totalWidth).to.equal(true);
    });

    it('配置 fieldAlias 后，对于相同的 data, 给定两个不同 `fieldAlias` 的 columns，计算的 totalWidth 一定相等', function () {
        const columns = copyColumns();
        const columns2 = copyColumns();
        const fieldAlias = 'fieldAlias';
        const fieldAlias2 = 'fieldAlias2';
        columns.map(c => { c[fieldAlias] = c.field; delete c.field;   return c;});
        columns2.map(c => { c[fieldAlias2] = c.field; delete c.field;   return c;});
        const result = getTableDataSize(columns, data, { fieldAlias: fieldAlias });
        const result2 = getTableDataSize(columns, data, { fieldAlias: fieldAlias2 });

        expect(result.totalWidth === result2.totalWidth).to.equal(true);
    });

    it('配置 frozenAlias 后，对于相同的 data, 指定相同的列固定，给定两个不同 `frozenAlias` 的 columns，计算的 frozenWidth 一定相等',
        function () {
            const columns = copyColumns();
            const columns2 = copyColumns();
            const frozenAlias = 'frozenAlias';
            const frozenAlias2 = 'frozenAlias2';
            columns.map(c => { c[frozenAlias] = true; return c;});
            columns2.map(c => { c[frozenAlias2] = true; return c;});
            const result = getTableDataSize(columns, data, { frozenAlias: frozenAlias });
            const result2 = getTableDataSize(columns2, data, { frozenAlias: frozenAlias2 });

            expect(result.frozenWidth === result2.frozenWidth).to.equal(true);
    });
});


