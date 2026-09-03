import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:rounded-xl group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg data-[type=success]:group-[.toaster]:!bg-accent data-[type=success]:group-[.toaster]:!text-accent-foreground data-[type=success]:group-[.toaster]:!border-transparent data-[type=error]:group-[.toaster]:!bg-destructive data-[type=error]:group-[.toaster]:!text-destructive-foreground data-[type=error]:group-[.toaster]:!border-transparent",
          description:
            "group-[.toast]:text-muted-foreground group-data-[type=success]:!text-accent-foreground/80 group-data-[type=error]:!text-destructive-foreground/80",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
