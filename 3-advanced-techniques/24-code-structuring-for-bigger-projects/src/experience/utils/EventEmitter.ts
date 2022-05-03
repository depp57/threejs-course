export default class EventEmitter<Events> {

  private readonly events = new Map<keyof Events, Function[]>();

  on<E extends keyof Events>(eventName: E, callback: (event: Events[E]) => any): EventEmitter<Events> {
    const existingCallbacks = this.events.get(eventName) ?? [];
    existingCallbacks.push(callback);

    this.events.set(eventName, existingCallbacks);

    return this;
  }

  off<E extends keyof Events>(eventName: E): EventEmitter<Events> {
    this.events.delete(eventName);

    return this;
  }

  protected trigger<E extends keyof Events>(eventName: E, args?: Events[E]): void {
    const existingCallbacks = this.events.get(eventName) ?? [];

    existingCallbacks.forEach(callback => callback(args));
  }

  protected getRegisteredEvents(): IterableIterator<keyof Events> {
    return this.events.keys();
  }
}
