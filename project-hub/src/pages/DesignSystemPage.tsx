import DesignRefBrowser from "@/components/designrefs/DesignRefBrowser";

export default function DesignSystemPage() {
  return (
    <DesignRefBrowser
      kind="system"
      basePath="/design-system"
      title="Design System"
      lead="The Excalibrr component reference — every component prototypes are built with, its states captured live from the demo, the props that matter, and the mistakes to avoid."
    />
  );
}
