import ListsContainer from "@/components/listsContainer/listsContainer";
import { getUser } from "@/utils/data";
import styles from "./page.module.css";

export default async function Home() {
  const user = await getUser();
  return (
    <div className={styles.page}>
      <div>Header and other stuff</div>
      <ListsContainer user={user} />
    </div>
  );
}
