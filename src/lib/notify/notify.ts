// TODO -- this can just be imported in the required places as not gaining anything creating a new file for this
import { Notify } from "notiflix/build/notiflix-notify-aio";

export const Success = (message: string) => Notify.success(message);
export const Failure = (message: string) => Notify.failure(message);
export const Warning = (message: string) => Notify.warning(message);
export const Info = (message: string) => Notify.info(message);
