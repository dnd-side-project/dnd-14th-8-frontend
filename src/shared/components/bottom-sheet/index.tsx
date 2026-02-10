import type { ComponentProps } from "react";
import { Drawer as DrawerPrimitive } from "vaul";
import { cn } from "@/shared/utils/cn";

function BottomSheet({
  ...props
}: ComponentProps<typeof DrawerPrimitive.Root>) {
  return <DrawerPrimitive.Root direction="bottom" {...props} />;
}

function BottomSheetTrigger({
  ...props
}: ComponentProps<typeof DrawerPrimitive.Trigger>) {
  return <DrawerPrimitive.Trigger {...props} />;
}

function BottomSheetClose({
  ...props
}: ComponentProps<typeof DrawerPrimitive.Close>) {
  return <DrawerPrimitive.Close {...props} />;
}

function BottomSheetContent({
  className,
  children,
  ...props
}: ComponentProps<typeof DrawerPrimitive.Content>) {
  return (
    <DrawerPrimitive.Portal>
      <DrawerPrimitive.Overlay className="fixed inset-0 z-40 bg-black/40" />
      <DrawerPrimitive.Content
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 flex max-h-[90vh] flex-col rounded-t-2xl bg-white",
          className,
        )}
        {...props}
      >
        <DrawerPrimitive.Handle className="mt-3 h-1 w-10 cursor-grab rounded-full bg-k-200 active:cursor-grabbing" />
        <div className="flex-1 overflow-y-auto px-4 pt-2 pb-4">{children}</div>
      </DrawerPrimitive.Content>
    </DrawerPrimitive.Portal>
  );
}

function BottomSheetTitle({
  className,
  ...props
}: ComponentProps<typeof DrawerPrimitive.Title>) {
  return (
    <DrawerPrimitive.Title
      className={cn("text-k-900 text-t1", className)}
      {...props}
    />
  );
}

function BottomSheetDescription({
  className,
  ...props
}: ComponentProps<typeof DrawerPrimitive.Description>) {
  return (
    <DrawerPrimitive.Description
      className={cn("text-b5 text-k-500", className)}
      {...props}
    />
  );
}

export {
  BottomSheet,
  BottomSheetTrigger,
  BottomSheetClose,
  BottomSheetContent,
  BottomSheetTitle,
  BottomSheetDescription,
};
