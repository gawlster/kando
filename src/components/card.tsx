import { type Card } from "@/utils/data";
import styles from "./card.module.css";

export default function Card({ data }: { data: Card }) {
  const dueStatus: string = "complete";
  const isDueSoon = dueStatus === "dueSoon";
  const isOverdue = dueStatus === "overdue";
  const isComplete = dueStatus === "complete";
  return (
    <div className={styles.card}>
      <h4>{data.title}</h4>
      {/* <div className={styles.tags}></div> */}
      <div
        className={`${styles.dates} ${isDueSoon ? styles.dueSoon : ""} ${
          isOverdue ? styles.overdue : ""
        } ${isComplete ? styles.complete : ""}`}
      >
        {data.startDate} - {data.endDate}
      </div>
    </div>
  );
}
