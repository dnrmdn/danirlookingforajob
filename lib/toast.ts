"use client";

import {
    gooeyToast,
    type GooeyToastOptions,
} from "goey-toast";

export const toast = {
    success: (
        title: string,
        options?: GooeyToastOptions
    ) => gooeyToast.success(title, options),

    error: (
        title: string,
        options?: GooeyToastOptions
    ) => gooeyToast.error(title, options),

    warning: (
        title: string,
        options?: GooeyToastOptions
    ) => gooeyToast.warning(title, options),

    info: (
        title: string,
        options?: GooeyToastOptions
    ) => gooeyToast.info(title, options),

    promise: gooeyToast.promise,

    dismiss: gooeyToast.dismiss,

    update: gooeyToast.update,
};