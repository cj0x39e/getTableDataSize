import { getTableDataSize } from '../src/index';
import { columns, data } from './data';

const expect = chai.expect;

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

    it('data 参数不是数组应该抛出错误', function() {
        expect(() => getTableDataSize([], null)).to.throw(/data/);
        expect(() => getTableDataSize([], '')).to.throw(/data/);
        expect(() => getTableDataSize([], {})).to.throw(/data/);
        expect(() => getTableDataSize([], 1)).to.throw(/data/);
        expect(() => getTableDataSize([], true)).to.throw(/data/);
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
});

describe('getTableDataSize 配置测试', function() {

    it('配置 columnMaxWidth 后，每列宽度不能超过该值', function () {
        const columns = copyColumns();
        getTableDataSize(columns, data, { columnMaxWidth: 1 });
        expect(columns.every(c => c.width <= 1)).to.equal(true);
    });

    it('配置 widthAlias 后，所有列的 widthAlias 字段值相加等于返回的 totalWidth', function () {
        const columns = copyColumns();
        const widthAlias = 'myWidth';
        const result = getTableDataSize(columns, data, { widthAlias: widthAlias });
        const sum = columns.reduce((r, c) => r + c[widthAlias], 0);
        expect(sum).to.equal(result.totalWidth);
    });

    it('配置 labelAlias 后，一份 data, 给定两个不同 `labelAlias` 的 columns 并设置其内容长于行的内容，计算的 totalWidth 一定相等', function () {
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

    it('配置 fieldAlias 后，一份 data, 给定两个不同 `fieldAlias` 的 columns，计算的 totalWidth 一定相等', function () {
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

    it('配置 frozenAlias 后，一份 data, 指定相同的列固定，只是使用不同的字段，计算的 frozenWidth 一定相等', function () {
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


