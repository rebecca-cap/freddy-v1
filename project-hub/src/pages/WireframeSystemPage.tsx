import DesignRefBrowser from "@/components/designrefs/DesignRefBrowser";

export default function WireframeSystemPage() {
  return (
    <DesignRefBrowser
      kind="wireframe"
      basePath="/wireframe-system"
      title="Wireframe Design System"
      lead="The lo-fi kit every wireframe round is built with — plain HTML and the wf- CSS class system. Each area shows its rendered states, the class API to use, copyable markup, and the density and color-intent laws to follow."
    />
  );
}
