import useSWR from "swr";
import styles from "./style.module.css";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function StatusPage() {
  return (
    <div className={(styles.pageContainer, styles.container)}>
      <h1 style={{ margin: "10px 0 0 0" }}>Status</h1>
      <UpdatedAt />
      <DatabaseInfo />
    </div>
  );
}

function UpdatedAt() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });
  let updatedAtText = "Carregando...";

  if (!isLoading && data) {
    updatedAtText = new Date(data.updated_at).toLocaleString("pt-BR");
  }

  return (
    <div className={(styles.container, styles.lastUpdated)}>
      Última atualização: {updatedAtText}
    </div>
  );
}

function DatabaseInfo() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });
  let dbInfo = {};
  if (!isLoading) {
    dbInfo = data.dependencies.database;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Banco de Dados:</h2>
      <p className={styles.listItem}>
        Versão do banco: {dbInfo.version ?? "Carregando..."}
      </p>
      <p className={styles.listItem}>
        Máximo de conexões: {dbInfo.max_connections ?? "Carregando..."}
      </p>
      <p className={styles.listItem}>
        Conexões abertas: {dbInfo.opened_connections ?? "Carregando..."}
      </p>
    </div>
  );
}
