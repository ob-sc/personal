export type JacandoAPI = (
  method: "get" | "post" | "put" | "delete",
  resource: string,
  data?: any
) => Promise<any>;
