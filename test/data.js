
const columns = [];
for (let i = 0; i < 10; i++) {
    columns.push({ label: 'head' + i, field: 'f' + i });
}

const data = [];
for (let i = 0; i < 300; i++) {
    const item = {};
    columns.forEach((c, j) => item[c.field] = 'hello world' + j + '' + i);
    data.push(item);
}

export { columns, data };
