import EventEmitter from './EventEmitter';

export type SizesEvent = { width: number, height: number, pixelRatio: number };

interface SizesEventMap {
  'resize': SizesEvent;
}

export default class Sizes extends EventEmitter<SizesEventMap> {

  private width: number;
  private height: number;
  public readonly pixelRatio: number;

  constructor() {
    super();

    this.width      = window.innerWidth;
    this.height     = window.innerHeight;
    this.pixelRatio = Math.min(window.devicePixelRatio, 2);

    window.addEventListener('resize', () => {
      this.width  = window.innerWidth;
      this.height = window.innerHeight;

      this.trigger('resize', {
        width: this.width,
        height: this.height,
        pixelRatio: this.pixelRatio
      });
    });
  }

  public getWidth(): number {
    return this.width;
  }

  public getHeight(): number {
    return this.height;
  }
}
