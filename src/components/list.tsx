import Card from "./card";
import styles from "./list.module.css";

export default function List() {
  return (
    <div className={styles.list}>
      <h3>List title</h3>
      <div className={styles.container}>
        <Card />
      </div>
    </div>
  );
}
