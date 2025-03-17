import { type List } from "@/utils/data";
import Card from "./card";
import styles from "./list.module.css";

export default function List({ data }: { data: List }) {
  return (
    <div className={styles.list}>
      <h3>{data.title}</h3>
      <div className={styles.container}>
        {data.cards.map((card) => (
          <Card key={card.id} data={card} />
        ))}
      </div>
    </div>
  );
}
