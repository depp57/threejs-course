import EventEmitter from './EventEmitter';

export type TimeEvent = { elapsed: number, delta: number };

interface TimeEventsMap {
  'tick': TimeEvent;
}

export default class Time extends EventEmitter<TimeEventsMap> {

  private start   = 0;
  private elapsed = 0;
  private delta   = 16;

  constructor() {
    super();

    window.requestAnimationFrame(elapsedTime => {
      this.start = elapsedTime;

      this.tick();
    });
  }

  tick(): void {
    window.requestAnimationFrame(elapsedTime => {
      this.delta   = elapsedTime - this.elapsed;
      this.elapsed = elapsedTime;

      this.trigger('tick', {
        delta: this.delta,
        elapsed: this.elapsed
      });

      this.tick();
    });
  }
}
