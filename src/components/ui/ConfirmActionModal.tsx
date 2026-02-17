"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import Button from "@/components/ui/button";
import { Check, AlertTriangle } from "lucide-react";

export type ConfirmActionVariant = "success" | "warning";

export interface ConfirmActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: React.ReactNode;
  confirmLabel: string;
  variant?: ConfirmActionVariant;
  loading?: boolean;
}

export default function ConfirmActionModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel,
  variant = "success",
  loading = false,
}: ConfirmActionModalProps) {
  const handleConfirm = async () => {
    try {
      await onConfirm();
      onClose();
    } catch {
      // Laisser la modal ouverte en cas d'erreur
    }
  };

  const isSuccess = variant === "success";
  const iconBg = isSuccess ? "bg-green-100" : "bg-amber-100";
  const iconColor = isSuccess ? "text-green-600" : "text-amber-600";
  const buttonVariant = isSuccess ? "success" : "warning";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div
              className={`h-12 w-12 rounded-full flex items-center justify-center shrink-0 ${iconBg}`}
            >
              {isSuccess ? (
                <Check className={`h-6 w-6 ${iconColor}`} />
              ) : (
                <AlertTriangle className={`h-6 w-6 ${iconColor}`} />
              )}
            </div>
            <div>
              <DialogTitle className="text-xl">{title}</DialogTitle>
              <DialogDescription asChild>
                <div className="text-sm text-gray-600 mt-1">{description}</div>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Annuler
          </Button>
          <Button
            variant={buttonVariant}
            onClick={handleConfirm}
            disabled={loading}
            className="flex items-center gap-2"
          >
            {loading ? "En cours..." : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
