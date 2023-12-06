function relMouseCoords(event) {
    var totalOffsetX = 0;
    var totalOffsetY = 0;
    var canvasX = 0;
    var canvasY = 0;
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    var currentElement = this;

    do {
        totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
        totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
    } while ((currentElement = currentElement.offsetParent));

    canvasX = event.pageX - totalOffsetX;
    canvasY = event.pageY - totalOffsetY;

    return { x: canvasX, y: canvasY };
}

export const addToPrototype = () => {
    HTMLCanvasElement.prototype.relMouseCoords = relMouseCoords;
};