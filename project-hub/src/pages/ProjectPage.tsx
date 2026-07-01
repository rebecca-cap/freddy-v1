import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProjectDetail from "@/components/ProjectDetail";
import { api, type ProjectDetail as ProjectDetailShape } from "@/lib/api";

export default function ProjectPage() {
  const { slug = "" } = useParams();
  const navigate = useNavigate();
  const [detail, setDetail] = useState<ProjectDetailShape | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const next = await api.getProject(slug);
      setDetail(next);
    } catch (err: any) {
      setError(err?.message ?? String(err));
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <>
      {loading && (
        <div className="text-sm text-muted-foreground">Loading project...</div>
      )}
      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}
      {detail && (
        <ProjectDetail
          detail={detail}
          onChange={load}
          onDeleted={() => navigate("/")}
        />
      )}
    </>
  );
}
