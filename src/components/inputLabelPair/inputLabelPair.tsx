import styles from "./inputLabelPair.module.css";

export default function InputLabelPair({
  id,
  label,
  value,
  onChange,
  textarea = false,
}: {
  id: string;
  label: string;
  value: string;
  onChange: React.ChangeEventHandler;
  textarea?: boolean;
}) {
  return (
    <div className={styles.inputLabelPair}>
      <label htmlFor={id}>{label}</label>
      {textarea ? (
        <textarea name={id} id={id} value={value} onChange={onChange} />
      ) : (
        <input
          type="text"
          name={id}
          id={id}
          value={value}
          onChange={onChange}
        />
      )}
    </div>
  );
}
