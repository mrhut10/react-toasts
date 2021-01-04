type listenerType<T> = (event: T) => void;

export default class PubSubEvent<T> {
  private listeners: Set<listenerType<T>> = new Set();
  public subscribe(listener: listenerType<T>) {
    this.listeners.add(listener);
  }
  public unsubscribe(listener: listenerType<T>) {
    if (this.listeners.has(listener)) this.listeners.delete(listener);
  }
  protected omit(data: T) {
    this.listeners.forEach((handler) => handler(data));
  }
}
