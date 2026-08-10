"use client";

import { GooeyToaster } from "goey-toast";
import "goey-toast/styles.css";

export function ToastProvider() {
    return (
        <GooeyToaster
            position="bottom-right"
            theme="dark"
        />
    );
}