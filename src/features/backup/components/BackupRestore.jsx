import BackupPanel from "./BackupPanel.jsx";

export default function BackupRestore({ onDataChange }) {
  return (
    <section>
      <BackupPanel onDataChange={onDataChange} />
    </section>
  );
}
