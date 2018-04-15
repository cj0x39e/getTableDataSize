
// 使用该思路获取文本宽度的原始出处：
// https://stackoverflow.com/questions/118241/calculate-text-width-with-javascript
export default function getTextWidth(text, font) {

    const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    const context = canvas.getContext('2d');

    context.font = font;

    return context.measureText(text).width;
}
