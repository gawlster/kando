import List from "@/components/list";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <div>Header and other stuff</div>
      <div className={styles.listsContainer}>
        <List />
      </div>
    </div>
  );
}
