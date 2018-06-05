/**
 * Inspired by：
 * {@link https://stackoverflow.com/questions/118241/calculate-text-width-with-javascript}
 */

let canvas;

function getTextWidth(text, font) {
    if (typeof text === 'undefined' || text === null) return 0;

    canvas = canvas || (canvas = document.createElement('canvas'));
    const context = canvas.getContext('2d');

    context.font = font;

    return context.measureText(text).width;
}

export default getTextWidth;
