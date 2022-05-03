import { TimeEvent } from '../utils/Time';

export interface Updatable {
  update(timeEvent: TimeEvent): void;
}
