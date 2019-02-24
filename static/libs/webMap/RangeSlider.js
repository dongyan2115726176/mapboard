/**
 * @description 分段专题图颜色控制滑块
 * @author chengl
 * @class RangeSlider
 */
class RangeSlider {
    /**
     * Creates an instance of RangeSlider.
     * @author chengl
     * @param {ol.map} map 地图对象
     * @param {Object} options 参数
     * @memberof RangeSlider
     */
    constructor(map, options) {
        this.map = map;
        let defaults = {
            target: options.target || document.getElementsByTagName('body')[0],
            info: ['低', '高'],
            visible: false
        };
        this.options = Object.assign({}, defaults, options);
        this.paths = {};
        this.init();
    }

    /**
     * @description 检查是否包含分段专题图层
     * @author chengl
     * @returns 
     * @memberof RangeSlider
     */
    checkAvailable() {
        let layers = this.map ? this.map.getLayers().getArray() : [];
        if (layers.length > 1
            && layers[1].type === 'VECTOR' 
            && layers[1].getProperties()
            && layers[1].getProperties().styleSource.styleGroups) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * @description 初始化函数
     * @author chengl
     * @memberof RangeSlider
     */
    init() {
        if (this.options.visible && this.checkAvailable()) {
            if (!this.canvas) {
                this.createCanvas();
            }
            //获取分段范围和分段颜色数组
            this.getInfo();
            //渐变色带
            this.drawGradient(false);
            //max
            this.drawSlider(40, 40, this.colors[this.colors.length - 1], this.range[1], true);
            //min
            this.drawSlider(40, 160, this.colors[0], this.range[0], false);
            //事件绑定
            this.bindEvent();
        } else {
            //移除滑块
            if (this.canvas) {
                this.target.removeChild(this.canvas);
                this.canvas = null;
            }
        }
    }

    /**
     * @description 生成滑块canvas
     * @author chengl
     * @memberof RangeSlider
     */
    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'rangeSliderCanvas';
        this.canvas.width = 110;
        this.canvas.height = 200;
        this.canvas.style.position = 'absolute';
        this.canvas.style.zIndex = 1;
        this.canvas.style.left = 0;
        this.canvas.style.bottom = 0;
        this.options.target.appendChild(this.canvas);
        this.ctx = this.getContext();
    }

    /**
     * @description 获取canvas上下文
     * @author chengl
     * @returns 
     * @memberof RangeSlider
     */
    getContext() {
        if (this.canvas && this.canvas.getContext) {
            return this.canvas.getContext('2d');
        }
    }

    /**
     * @description 获取分段范围和分段颜色数组
     * @author chengl
     * @memberof RangeSlider
     */
    getInfo() {
        let styleSource = this.map.getLayers().getArray()[1].getProperties(),
            styleGroups = styleSource.styleSource.styleGroups;
        //分段范围
        const len = styleGroups.length;
        this.range = [Math.floor(styleGroups[0].start), Math.ceil(styleGroups[len - 1].end)];
        //颜色数组
        let colors = [];
        styleGroups.forEach(style => {
            colors.push(style.color);
        });
        this.colors = colors;
    }
    
    /**
     * @description 获取分段颜色数组
     * @author chengl
     * @memberof RangeSlider
     */
    getColors() {
        const styleSource = this.map.getLayers().getArray()[1].getProperties(),
            styleGroups = styleSource.styleSource.styleGroups;
        const colors = [];
        
        this.colors = colors;
    }

    /**
     * @description 生成图形绘制路径
     * @author chengl
     * @param {Array} points 路径点集
     * @returns 
     * @memberof RangeSlider
     */
    createPath(points) {
        if (!points || points.length < 3) {
            return;
        }
        this.ctx.beginPath();
        this.ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1, len = points.length; i < len; i++) {
            this.ctx.lineTo(points[i].x, points[i].y);
        }
        this.ctx.closePath();
    }

    /**
     * @description 生成canvas渐变色
     * @author chengl
     * @returns 
     * @memberof RangeSlider
     */
    getGradient() {
        let gradient = this.ctx.createLinearGradient(0, 160, 0, 40);
        const len = this.colors.length;
        if (len < 2) {
            throw new Error('渐变色数组长度必须大于或等于2');
        }
        this.colors.forEach((color, idx) => {
            const stop = idx / (len - 1);
            gradient.addColorStop(stop, color);
        });
        return gradient;
    }

    /**
     * @description 绘制渐变色模块
     * @author chengl
     * @param {boolean} isRedraw
     * @memberof RangeSlider
     */
    drawGradient(isRedraw) {
        this.ctx.save();
        //创建渐变色
        this.gradient = this.getGradient();
        //绘制渐变色
        this.ctx.fillStyle = this.gradient;
        const gradientRect = [ {x: 20, y: 40}, {x: 40, y: 40}, {x: 40, y: 160}, {x: 20, y: 160} ];
        this.createPath(gradientRect);
        this.ctx.fill();
        //绘制文本，只绘制一次
        if (!isRedraw) {
            this.ctx.font = '14px 微软雅黑';
            this.ctx.textBaseline = 'top';
            this.ctx.textAlign = 'center';
            this.ctx.fillStyle = '#000';
            this.ctx.fillText(this.options.info[1], 30, 15, 60);
            this.ctx.textBaseline = 'bottom';
            this.ctx.fillText(this.options.info[0], 30, 185, 60);
        }
        //保存path
        this.paths.gradientPath = gradientRect;
        this.ctx.restore();
    }

    /**
     * @description 绘制滑块
     * @author chengl
     * @param {Number} x 滑块x坐标
     * @param {Number} y 滑块y坐标
     * @param {String} color 滑块颜色
     * @param {String} text 滑块显示文本
     * @param {Boolean} isMax 是否大值的滑块
     * @memberof RangeSlider
     */
    drawSlider(x, y, color, text, isMax) {
        this.ctx.save();
        this.ctx.fillStyle = color;
        let sliderPath = null, sliderTextPath = null, w = this.ctx.measureText(text).width + 15;
        //绘制滑块
        if (isMax) {
            this.ctx.textBaseline = 'middle';
            sliderPath = [ {x, y}, {x: x + 10, y}, {x: x + 10, y: y - 10} ];
            sliderTextPath = [ {x, y}, {x: x + w, y}, {x: x + w, y: y - 10}, {x, y: y - 10} ];
            this.createPath(sliderPath);
            y -= 5;
        } else {
            this.ctx.textBaseline = 'middle';
            sliderPath = [ {x, y}, {x: x + 10, y: y}, {x: x + 10, y: y + 10} ];
            sliderTextPath = [ {x, y}, {x: x + w, y}, {x: x + w, y: y + 10}, {x, y: y + 10} ];
            this.createPath(sliderPath);
            y += 5;
        }
        this.ctx.fill();
        //绘制文本
        this.ctx.fillStyle = '#000';
        this.ctx.font = '12px 微软雅黑';
        this.ctx.fillText(text, x + 15, y);
        //保存path
        this.paths[isMax ? 'maxPath' : 'minPath'] = sliderTextPath;
        this.ctx.restore();
    }

    /**
     * @description 事件绑定
     * @author chengl
     * @memberof RangeSlider
     */
    bindEvent() {
        //鼠标在渐变色带上移动事件
        this.options.hoverCallBack && this.canvas.addEventListener('mousemove', (e) => {
            this.createPath(this.paths.gradientPath);
            if (this.ctx.isPointInPath(e.offsetX, e.offsetY)) {
                //当滑块移到最底部时，将取色像素的Y坐标-1，否则取不到渐变色带的像素信息
                const colorY = e.offsetY === this.paths.gradientPath[2].y ? e.offsetY - 1 : e.offsetY;
                let color = this.ctx.getImageData(e.offsetX, colorY, 1, 1).data;
                color = `RGBA(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`;
                const value = this.getValue(e.offsetY);
                //执行回调函数
                this.options.hoverCallBack(value, color);
            }
        })
        //滑块鼠标按下事件
        this.options.dragCallBack && this.options.hoverCallBack && this.canvas.addEventListener('mousedown', (e) => {
            for (const path in this.paths) {
                if (path === 'maxPath' || path === 'minPath') {
                    this.createPath(this.paths[path]);
                    if (this.ctx.isPointInPath(e.offsetX, e.offsetY)) {
                        const deltaY = this.paths[path][0].y - e.offsetY;
                        document.onmousemove = this.sliderMove.bind(this, deltaY);
                        document.onmouseup = this.sliderUp;
                        return;
                    }
                }
            }
            
        })
    }

    /**
     * @description 滑块拖动事件
     * @author chengl
     * @param {Number} deltaY 鼠标点击位置与滑块边沿的差值
     * @param {Object} e 
     * @memberof RangeSlider
     */
    sliderMove(deltaY, e) {
        const isMax = deltaY > 0 ? true : false;
        let Y = e.clientY - this.canvas.offsetTop + deltaY;
        if (isMax) {
            Y = Y < this.paths.gradientPath[0].y ? this.paths.gradientPath[0].y : Y;
            Y = Y > this.paths.minPath[0].y ? this.paths.minPath[0].y : Y;
        } else {
            Y = Y < this.paths.maxPath[0].y ? this.paths.maxPath[0].y : Y;
            Y = Y > this.paths.gradientPath[2].y ? this.paths.gradientPath[2].y : Y;
        }
        //当滑块移到最底部时，将取色像素的Y坐标-1，否则取不到渐变色带的像素信息
        const colorY = Y === this.paths.gradientPath[2].y ? Y - 1 : Y;
        let color = this.ctx.getImageData(20, colorY, 1, 1).data;
        color = `RGBA(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`;
        let maxValue, minValue, value;
        if (isMax) {
            value = maxValue = this.getValue(Y);
            minValue = this.getValue(this.paths.minPath[0].y);
            this.ctx.clearRect(this.paths.maxPath[0].x, this.paths.maxPath[0].y - 10, this.canvas.width - this.paths.gradientPath[1].x, 10);
        } else {
            value = minValue = this.getValue(Y);
            maxValue = this.getValue(this.paths.maxPath[0].y);
            this.ctx.clearRect(this.paths.minPath[0].x, this.paths.minPath[0].y, this.canvas.width - this.paths.gradientPath[1].x, 10);
        }
        // const value = this.getValue(Y);
        this.drawSlider(40, Y, color, value, isMax);
        //执行回调函数
        this.options.dragCallBack(maxValue, minValue);
    }

    /**
     * @description 滑块拖动后鼠标弹起事件
     * @author chengl
     * @memberof RangeSlider
     */
    sliderUp() {
        document.onmousemove = null;
        document.onmouseup = null;
    }

    /**
     * @description 获取滑块当前位置的数值
     * @author chengl
     * @param {Number} y 滑块位置
     * @returns 
     * @memberof RangeSlider
     */
    getValue(y) {
        let range = this.range[1] - this.range[0];
        let value = (y - 40) * (range / 120);
        value = parseInt(this.range[1] - value);
        return value;
    }

    /**
     * @description 设置滑块可见性
     * @author chengl
     * @param {Boolean} isVisible 是否可见
     * @memberof RangeSlider
     */
    setVisible(isVisible) {
        this.options.visible = isVisible;
        this.init();
    }
}