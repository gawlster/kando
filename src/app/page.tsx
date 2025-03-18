import { getUser } from "@/utils/data";
import List from "../components/list";
import styles from "./page.module.css";

export default async function Home() {
  const user = await getUser();
  return (
    <div className={styles.page}>
      <div>Header and other stuff</div>
      <div className={styles.listsContainer}>
        {user?.lists.map((list) => (
          <List key={list.id} data={list} />
        ))}
      </div>
    </div>
  );
}
