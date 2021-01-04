import PubSubEvent from "./PubSubEvent";
import { toastStatus } from "./DefaultConfiguration";

export interface IToastsStore {
  status: toastStatus;
  message: string | React.ReactNode;
  timer: number;
  classNames: string[] | string;
}

export const partialApply = <A extends unknown[], B extends unknown[], O>(
  func: (...args: [...A, ...B]) => O,
  ...argsA: A
) => (...argsB: B) => func(...argsA, ...argsB);

export class ToastStore extends PubSubEvent<IToastsStore> {
  private _toast(
    status: toastStatus,
    message: React.ReactNode,
    timer: number = 3000,
    classNames: string | string[] = ""
  ) {
    this.omit({ status, message, timer, classNames });
  }

  readonly success = partialApply(this._toast, "success");
  readonly info = partialApply(this._toast, "info");
  readonly warning = partialApply(this._toast, "warning");
  readonly error = partialApply(this._toast, "error");
}
