/**
 * Registry override for Alert, and for the toast()/Toaster pair exported from the same module.
 */
export const componentMeta = {
    description:
        "Inline status banner (Alert: color info|success|warning|error, size sm|md, title, description, actions, onDismiss) and, from the same module, transient notifications: mount <Toaster /> once near the app root, then call toast(title, options) / toast.success / toast.error / toast.warning / toast.info / toast.dismiss(id) from anywhere. description renders block content, so lists or a CodeBlock may go there or in children.",
    variants: { color: ["info", "success", "warning", "error"], size: ["sm", "md"] },
    a11y: "error/warning use role=alert (assertive); info/success use role=status. A dismissible Alert focuses its close button on mount unless autoFocus={false} -- turn it off for alerts present on page load. Toasts don't take focus unless you pass { autoFocus: true }; pass { duration: Infinity } for errors the user must read.",
    doNot: [
        "Do not build red/amber boxes from divs for errors -- use Alert.",
        "Do not use a toast for an error the user has to act on; keep it inline (Alert) or make it persistent (duration: Infinity).",
        "Do not mount more than one <Toaster />.",
    ],
    examples: [
        {
            title: "Inline error with action",
            code: '<Alert color="error" title="Couldn\'t load contacts" description="Check your connection and try again." actions={<Button size="sm" color="link-color" onClick={retry}>Try again</Button>} />',
        },
        { title: "Toaster at the root", code: "<RouterProvider navigate={navigate}>\n  <App />\n  <Toaster />\n</RouterProvider>" },
        {
            title: "Success and persistent error toasts",
            code: 'toast.success("Template saved");\ntoast.error("Refresh failed", { description: error.message, duration: Infinity });',
        },
    ],
};
