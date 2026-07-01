import DesignRefBrowser from "@/components/designrefs/DesignRefBrowser";

export default function DesignPatternsPage() {
  return (
    <DesignRefBrowser
      kind="patterns"
      basePath="/design-patterns"
      title="Design Patterns"
      lead="The layout rulebook — how components compose into real screens. Spacing, hierarchy, forms, surfaces, and page anatomy, stated as rules a new design can follow."
    />
  );
}
