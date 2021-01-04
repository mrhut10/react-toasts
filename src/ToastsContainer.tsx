import React from "react";
import ReactDOM from "react-dom";
import {
  DarkColors,
  LightColors,
  ToastStyleByPositionLookup,
  ToastsContainerPosition,
} from "./DefaultConfiguration";
import { ToastStore, IToastsStore } from "./ToastsStore";

export interface IToastsContainerProps {
  position: ToastsContainerPosition;
  store: React.MutableRefObject<ToastStore>;
  lightBackground?: boolean;
  className?: string | string[];
}

export interface IToastsContainerState {
  styles: any;
  toasts: any[];
}

// hook which will take an event with a ttl
const useEventWithTTL = <T extends any = any>() => {
  const [eventStore, setEventStore] = React.useState<
    Array<{ event: T; timer: number }>
  >([]);

  React.useEffect(() => {
    return () => {
      eventStore.forEach((row) => clearTimeout(row.timer));
      setEventStore([]);
    };
  });

  const removeEvent = (event: T) =>
    void setEventStore(eventStore.filter((row) => row.event !== event));

  const addEvent = (event: T, timeout: number) => {
    const item = { event, timer: setTimeout(removeEvent, timeout, event) };
    setEventStore([...eventStore, item]);
  };
  return {
    addEvent,
    currentEvents: eventStore.map((row) => row.event),
  };
};

export const ToastsContainer = ({
  position = ToastsContainerPosition.TOP_CENTER,
  store = React.useRef(new ToastStore()),
  className = "",
  lightBackground = false,
}: IToastsContainerProps) => {
  const { addEvent, currentEvents } = useEventWithTTL<IToastsStore>();

  const toastStore = store.current;

  React.useEffect(() => {
    const newEventHandler = (event: IToastsStore) =>
      addEvent(event, event.timer);

    toastStore.subscribe(newEventHandler);

    return () => {
      // slightly irelivant as the toastStore would be destroyed after component gets unmounted
      toastStore.unsubscribe(newEventHandler);
    };
  }, [toastStore]);

  const style = ToastStyleByPositionLookup[position];
  const theme = lightBackground ? LightColors : DarkColors;
  const container = (
    <div style={style} className={"toast-container " + className}>
      {currentEvents.map((toast) => (
        <div
          key={Math.random() * 1000000}
          className={`toast toast-${toast.status} ${toast.classNames}`}
          style={theme[toast.status]}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
  return ReactDOM.createPortal(container, document.body);
};
