import { getNisabConfig } from "@/actions/nisab";
import KalkulatorClient from "./KalkulatorClient";

export const revalidate = 0; // Disable static caching so page always gets latest nisab config

export default async function KalkulatorPage() {
  const nisabConfig = await getNisabConfig();

  return <KalkulatorClient nisabConfig={nisabConfig} />;
}
