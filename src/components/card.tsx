import styles from "./card.module.css";

export default function Card() {
  const dueStatus: string = "complete";
  const isDueSoon = dueStatus === "dueSoon";
  const isOverdue = dueStatus === "overdue";
  const isComplete = dueStatus === "complete";
  return (
    <div className={styles.card}>
      <h4>Card title</h4>
      {/* <div className={styles.tags}></div> */}
      <div
        className={`${styles.dates} ${isDueSoon ? styles.dueSoon : ""} ${
          isOverdue ? styles.overdue : ""
        } ${isComplete ? styles.complete : ""}`}
      >
        2022/09/01 - 2022/09/30
      </div>
    </div>
  );
}
