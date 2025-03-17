import List from "@/components/list";
import { getData } from "@/utils/data";
import styles from "./page.module.css";

export default async function Home() {
  const data = await getData();
  return (
    <div className={styles.page}>
      <div>Header and other stuff</div>
      <div className={styles.listsContainer}>
        {data.map((list) => (
          <List key={list.id} data={list} />
        ))}
      </div>
    </div>
  );
}
