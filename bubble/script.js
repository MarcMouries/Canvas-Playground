


/*********************
 *	Helpers Code
 ********************/
/**
 *  @function   DOMReady
 *
 *  @param callback
 *  @param element
 *  @param listener
 *  @returns {*}
 *  @constructor
 */
const DOMReady = (
callback = () => {},
element = document,
listener = 'addEventListener') =>
{
  return element[listener] ? element[listener]('DOMContentLoaded', callback) : window.attachEvent('onload', callback);
};


/*********************
 *	Application Code
 ********************/
/**
 *  @class CreateCanvasScene
 */
class CreateCanvasScene {
  /**
   *  @constructor
   *
   *  @param element
   *  @param options
   */
  constructor(element, options) {
    this.objectsArray = [];

    this.canvas = document.querySelector(element) || document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.options = Object.assign({
      'canvas': {
        'style': {
          'position': 'absolute',
          'zIndex': '1' },

        'width': this.context.width || window.innerWidth,
        'height': this.context.height || window.innerHeight } },

    options);

    this._init();
  }
  /**
   *  @function _init
   *
   *  @private
   */
  _init() {
    this.canvas.width = this.options.canvas.width;
    this.canvas.height = this.options.canvas.height;

    this.canvas.style.position = this.options.canvas.style.position;
    this.canvas.style.zIndex = this.options.canvas.style.zIndex;

    document.body.appendChild(
    this.canvas);

  }
  /**
   *  @function addObject
   *
   *  @param object
   */
  addObject(object) {
    this.objectsArray.push(object);
  }
  /**
   *  @function render
   */
  render() {
    this.context.clearRect(
    0,
    0,
    this.context.canvas.width,
    this.context.canvas.height);


    this.objectsArray.forEach(object => {
      return object.draw(this.context);
    });
  }
  /**
   *  @function animationScene
   */
  animationScene() {
    this.render();

    window.requestAnimationFrame(
    this.animationScene.bind(this, this.canvas));

  }}


/**
 *  @class CreateCanvasBubble
 */
class CreateCanvasBubble {
  /**
   *  @constructor
   *
   *  @param options
   */
  constructor(options) {
    this.isActivatedAction = false;

    this.options = Object.assign({
      'circle': {
        'x': '100',
        'y': '100',
        'radius': '100',
        'style': {
          'default': {
            'fillStyle': 'rgba(0, 142, 175, .3)',
            'strokeStyle': 'rgba(0, 142, 175, .7)' },

          'active': {
            'fillStyle': 'rgba(190, 53, 46, .3)',
            'strokeStyle': 'rgba(190, 53, 46, .7)' } },


        'animation': {
          'speed': '410' } } },


    options);
  }
  /**
   *  @function _rand
   *
   *  @param startValue
   *  @param endValue
   *  @returns {number}
   *  @private
   */
  _rand(startValue, endValue) {
    let currentTime = new Date().getTime(),
    speed = this.options.circle.animation.speed;

    return ~~(Math.sin(currentTime / speed) * (endValue - startValue + 1) + startValue);
  }
  /**
   *  @function draw
   *
   *  @param context
   */
  draw(context) {
    this.context = context;

    this.context.beginPath();
    this.context.save();
    this.context.ellipse(
    this.options.circle.x,
    this.options.circle.y,
    this.isActivatedAction ?
    this.options.circle.radius - this._rand(0, 27) :
    this.options.circle.radius - this._rand(0, 15),
    this.isActivatedAction ?
    this.options.circle.radius - this._rand(0, 17) :
    this.options.circle.radius - this._rand(0, 25),
    0,
    0,
    2 * Math.PI,
    false);

    this.context.restore();
    this.context.fill();

    if (this.isActivatedAction) {
      this.context.fillStyle = this.options.circle.style.active.fillStyle;
      this.context.strokeStyle = this.options.circle.style.active.strokeStyle;
    } else
    {
      this.context.fillStyle = this.options.circle.style.default.fillStyle;
      this.context.strokeStyle = this.options.circle.style.default.strokeStyle;
    }

    this.context.stroke();
  }
  /**
   *  @function followToCursor
   */
  followToCursor() {
    window.addEventListener('mousemove', e => {
      this.options.circle.x = e.pageX;
      this.options.circle.y = e.pageY;

      this.draw(this.context);
    }, false);
  }
  /**
   *  @function clickAction
   */
  clickAction() {
    window.addEventListener('mousedown', e => {
      this.isActivatedAction = this.isActivatedAction ? false : true;
    }, false);
  }}



/**
 *  @function   readyFunction
 *
 *  @type {Function}
 */
const readyFunction = () => {
  let canvasScene = new CreateCanvasScene(),
  canvasBubble = new CreateCanvasBubble();

  canvasScene.addObject(canvasBubble);
  canvasScene.animationScene();

  canvasBubble.followToCursor();
  canvasBubble.clickAction();
};


/**
 *  Launcher
 */
DOMReady(readyFunction);