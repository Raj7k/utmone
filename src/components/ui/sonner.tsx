import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-secondary-label",
          actionButton: "group-[.toast]:text-white",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-secondary-label",
        },
        style: {
          // Action button styling via inline
        },
      }}
      {...props}
    />
  );
};

// Add global styles for toast action button
const ToasterStyles = () => (
  <style>{`
    .toast [data-button] {
      background: rgba(59,130,246,1) !important;
      color: white !important;
    }
  `}</style>
);

export { Toaster, ToasterStyles, toast };
