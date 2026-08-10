"use client";

import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { AlertTriangle } from "lucide-react";
import { ReactNode } from "react";

interface ConfirmDialogProps {
    children: ReactNode;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "default" | "destructive";
    onConfirm: () => void;
}

export function ConfirmDialog({
    children,
    title,
    description,
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "default",
    onConfirm,
}: ConfirmDialogProps) {
    return (
        <AlertDialog.Root>
            <AlertDialog.Trigger asChild>
                {children}
            </AlertDialog.Trigger>

            <AlertDialog.Portal>
                <AlertDialog.Overlay className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" />

                <AlertDialog.Content
                    className="
            fixed
            left-1/2
            top-1/2
            z-[9999]
            w-[92vw]
            max-w-md
            -translate-x-1/2
            -translate-y-1/2
            rounded-2xl
            border
            border-white/10
            bg-[#111827]/95
            backdrop-blur-xl
            shadow-2xl
            p-6
            animate-in
            zoom-in-95
            fade-in
            duration-200
          "
                >
                    <div className="flex items-start gap-4">
                        <div
                            className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-xl
                bg-red-500/10
                border
                border-red-500/20
              "
                        >
                            <AlertTriangle className="h-6 w-6 text-red-400" />
                        </div>

                        <div className="flex-1">
                            <AlertDialog.Title className="text-lg font-semibold text-white">
                                {title}
                            </AlertDialog.Title>

                            <AlertDialog.Description className="mt-2 text-sm text-gray-400 leading-relaxed">
                                {description}
                            </AlertDialog.Description>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end gap-3">
                        <AlertDialog.Cancel
                            className="
                rounded-xl
                border
                border-white/10
                bg-white/5
                px-4
                py-2
                text-sm
                text-gray-300
                hover:bg-white/10
                transition
              "
                        >
                            {cancelText}
                        </AlertDialog.Cancel>

                        <AlertDialog.Action
                            onClick={onConfirm}
                            className={
                                variant === "destructive"
                                    ? `
                    rounded-xl
                    bg-red-600
                    px-4
                    py-2
                    text-sm
                    font-medium
                    text-white
                    hover:bg-red-500
                    transition
                  `
                                    : `
                    rounded-xl
                    bg-violet-600
                    px-4
                    py-2
                    text-sm
                    font-medium
                    text-white
                    hover:bg-violet-500
                    transition
                  `
                            }
                        >
                            {confirmText}
                        </AlertDialog.Action>
                    </div>
                </AlertDialog.Content>
            </AlertDialog.Portal>
        </AlertDialog.Root>
    );
}