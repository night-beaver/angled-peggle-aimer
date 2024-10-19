function deg2rad(deg) {
    return deg * (Math.PI / 180);
}
function rad2deg(rad) {
    return rad * (180 / Math.PI);
}
class Vec2D {
    x;
    y;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    clone() {
        return new Vec2D(this.x, this.y);
    }
    multiplyScalar(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }
    length() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }
    normalize() {
        this.multiplyScalar(1 / this.length());
        return this;
    }
    add(other) {
        this.x += other.x;
        this.y += other.y;
        return this;
    }
    subtract(other) {
        this.x -= other.x;
        this.y -= other.y;
        return this;
    }
    angle() {
        return Math.atan2(this.y, this.x);
    }
    rotate(rad) {
        let result = Vec2D.fromAngle(rad + this.angle());
        result.multiplyScalar(this.length());
        this.copy(result);
        return this;
    }
    copy(source) {
        this.x = source.x;
        this.y = source.y;
        return this;
    }
    static fromAngle(rad) {
        let x = Math.cos(rad);
        let y = Math.sin(rad);
        return new Vec2D(x, y);
    }
}
export default class PeggleAimerElement extends HTMLElement {
    svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    baseGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    handGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    _width = 0;
    get width() {
        return this._width;
    }
    set width(value) {
        let old = this._width;
        this._width = value;
        if (value == old) {
            return;
        }
        this.style.width = `${this.width}px`;
        this.svg.setAttribute('width', `${this.width}`);
        this.addDial();
    }
    _height = 0;
    get height() {
        return this._height;
    }
    set height(value) {
        let old = this._height;
        this._height = value;
        if (value == old) {
            return;
        }
        this.style.height = `${this.height}px`;
        this.svg.setAttribute('height', `${this.height}`);
        this.addDial();
    }
    lineStyle = {
        stroke: 'black',
        'stroke-width': '1.5px',
        'stroke-linecap': 'round',
    };
    _angleIncrement = 20;
    get angleIncrement() {
        return this._angleIncrement;
    }
    set angleIncrement(value) {
        let old = this._angleIncrement;
        this._angleIncrement = value;
        if (value == old) {
            return;
        }
        this.addDial();
    }
    _innerRadius = 30;
    get innerRadius() {
        return this._innerRadius;
    }
    set innerRadius(value) {
        let old = this._innerRadius;
        this._innerRadius = value;
        if (value == old) {
            return;
        }
        this.addDial();
    }
    _margin = 40;
    get margin() {
        return this._margin;
    }
    set margin(value) {
        let old = this._margin;
        this._margin = value;
        if (value == old) {
            return;
        }
        this.addDial();
    }
    _topOffset = 10;
    get topOffset() {
        return this._topOffset;
    }
    set topOffset(value) {
        this._topOffset = value;
        this.addDial();
    }
    observer = new MutationObserver(() => {
        this.checkAttributes();
    });
    mouseListener = (e) => {
        this.handGroup.innerHTML = '';
        let angle;
        let pos = new Vec2D(e.clientX, e.clientY);
        let bb = this.svg.getBoundingClientRect();
        pos.subtract(new Vec2D(bb.left, bb.top));
        pos.y -= this.topOffset;
        pos.x -= this.width / 2;
        angle = Math.atan2(pos.y, pos.x);
        angle = rad2deg(angle);
        this.addHand(angle, 'red');
    };
    constructor() {
        super();
    }
    connectedCallback() {
        this.width = 500;
        this.height = 500;
        this.appendChild(this.svg);
        this.svg.appendChild(this.baseGroup);
        this.svg.appendChild(this.handGroup);
        this.style.display = 'block';
        this.addDial();
        this.checkAttributes();
        this.observer.observe(this, { attributes: true });
    }
    addDial() {
        this.clear();
        let angle;
        for (angle = 0; angle < 180; angle += this.angleIncrement) {
            this.addLine(this.baseGroup, angle);
            this.addTextElement(this.baseGroup, angle);
        }
        this.addLine(this.baseGroup, 180);
        this.addTextElement(this.baseGroup, 180);
    }
    getRadius() {
        return Math.min(this.width / 2, this.height);
    }
    addHand(angle, color = 'red') {
        let result = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        result.angle = angle;
        this.handGroup.appendChild(result);
        let t = this.addTextElement(result, angle);
        let p = this.createArrow(angle, 20);
        result.appendChild(p);
        p.style.fill = color;
        p.style.fillOpacity = '0.5';
        p.style.stroke = color;
        p.style.strokeWidth = '2px';
        t.style.fill = color;
        result.appendChild(p);
        result.appendChild(t);
        return result;
    }
    refresh() {
        this.clear();
        this.addDial();
    }
    addTextElement(group, angle, radius = this.getRadius(), margin = this.margin / 2) {
        let textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        group.appendChild(textElement);
        textElement.innerHTML = `${angle.toFixed(0)}`;
        let position = new Vec2D(Math.cos(deg2rad(angle)), Math.sin(deg2rad(angle)));
        let bb = textElement.getBBox();
        position.multiplyScalar(radius - margin);
        position.x += this.width / 2;
        position.y += this.topOffset;
        position.subtract(new Vec2D(bb.width / 2, bb.height / -2));
        textElement.setAttribute('x', `${position.x}`);
        textElement.setAttribute('y', `${position.y}`);
        return textElement;
    }
    addLine(group, angle, radius = this.getRadius(), style = this.lineStyle, innerRadius = this.innerRadius, margin = this.margin) {
        angle = deg2rad(angle);
        let lineStart = new Vec2D(Math.cos(angle), Math.sin(angle));
        let lineEnd = lineStart.clone();
        lineEnd.multiplyScalar(radius - margin);
        lineStart.multiplyScalar(innerRadius);
        lineStart.x += this.width / 2;
        lineEnd.x += this.width / 2;
        lineStart.y += this.topOffset;
        lineEnd.y += this.topOffset;
        let lineElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        group.appendChild(lineElement);
        lineElement.setAttribute('d', `M${lineStart.x} ${lineStart.y} L${lineEnd.x} ${lineEnd.y}`);
        for (const [key, value] of Object.entries(style)) {
            lineElement.style.setProperty(key, value);
        }
        return lineElement;
    }
    clear() {
        this.baseGroup.innerHTML = '';
        this.handGroup.innerHTML = '';
    }
    createArrow(angle, width) {
        let radius = this.getRadius();
        angle = deg2rad(angle);
        let direction = new Vec2D(Math.cos(angle), Math.sin(angle));
        let pathStart = direction.clone();
        let pointPosition = direction.clone();
        pointPosition.multiplyScalar(radius - this.margin);
        pathStart.multiplyScalar(this.innerRadius);
        pathStart.x += this.width / 2;
        pointPosition.x += this.width / 2;
        pathStart.y += this.topOffset;
        pointPosition.y += this.topOffset;
        let pathEnd = pathStart.clone();
        pathStart.add(direction
            .clone()
            .rotate(Math.PI / 2)
            .multiplyScalar(width / 2));
        pathEnd.add(direction
            .clone()
            .rotate(-Math.PI / 2)
            .multiplyScalar(width / 2));
        let lineElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        lineElement.style.fill = 'black';
        lineElement.setAttribute('d', [
            `M${pathStart.x} ${pathStart.y}`,
            `L${pointPosition.x} ${pointPosition.y}`,
            `L${pathEnd.x} ${pathEnd.y}`,
            'Z',
        ].join(' '));
        // for (const [key, value] of Object.entries(style)) {
        //     lineElement.style.setProperty(key, value);
        // }
        return lineElement;
    }
    checkAttributes() {
        const att = (attName) => {
            return parseFloat(this.getAttribute(attName));
        };
        this.width = att('width') || this.width;
        this.height = att('height') || this.height;
        this.angleIncrement = att('angle-increment') || this.angleIncrement;
        this.innerRadius = att('inner-radius') || this.innerRadius;
        this.margin = att('margin') || this.margin;
        this.topOffset = att('top-offset') || this.topOffset;
        if (this.hasAttribute('mouse')) {
            this.addEventListener('mousemove', this.mouseListener);
        }
        else {
            this.removeEventListener('mousemove', this.mouseListener);
        }
    }
}
customElements.define('peggle-aimer', PeggleAimerElement);
