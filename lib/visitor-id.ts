const STORAGE_KEY = "paam_visitor_id";

// Id anônimo por navegador, usado só para não deixar a mesma pessoa (sem
// login) registrar "tenho interesse" mais de uma vez no mesmo país.
export function getOrCreateVisitorId(): string {
  try {
    const existing = localStorage.getItem(STORAGE_KEY);
    if (existing) return existing;

    const id = crypto.randomUUID();
    localStorage.setItem(STORAGE_KEY, id);
    return id;
  } catch {
    return crypto.randomUUID();
  }
}
