import { useRef, useState } from "react";
import { Download, RotateCcw, Upload } from "lucide-react";
import Button from "../../../components/ui/Button.jsx";
import Card from "../../../components/ui/Card.jsx";
import { exportBackup, importBackupFile, resetAllData } from "../backupService.js";

export default function BackupPanel({ onDataChange }) {
  const inputRef = useRef(null);
  const [message, setMessage] = useState(null);

  function showMessage(result) {
    setMessage({
      type: result.ok ? "success" : "error",
      text: result.message,
    });
  }

  function handleExport() {
    showMessage(exportBackup());
  }

  function handleImportClick() {
    inputRef.current?.click();
  }

  async function handleImport(event) {
    const file = event.target.files?.[0];
    event.target.value = "";

    const confirmed = window.confirm(
      "Importing a backup will replace all current local data. Continue?",
    );
    if (!confirmed) return;

    const result = await importBackupFile(file);
    showMessage(result);
    if (result.ok) onDataChange(result.data);
  }

  function handleReset() {
    const confirmed = window.confirm(
      "Delete all local finance tracker data? This cannot be undone unless you have a backup.",
    );
    if (!confirmed) return;

    const result = resetAllData();
    showMessage(result);
    onDataChange(result.data);
  }

  return (
    <Card className="p-5">
      <div className="grid gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-950">Backup and restore</h2>
          <p className="mt-1 text-sm text-gray-500">
            Export, restore, or reset the local data saved in this browser.
          </p>
        </div>

        {message ? (
          <div
            className={`rounded-md border px-3 py-2 text-sm ${
              message.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {message.text}
          </div>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <Button type="button" variant="secondary" onClick={handleExport}>
            <Download size={16} aria-hidden="true" />
            Export Backup
          </Button>
          <Button type="button" variant="secondary" onClick={handleImportClick}>
            <Upload size={16} aria-hidden="true" />
            Import Backup
          </Button>
          <Button type="button" variant="danger" onClick={handleReset}>
            <RotateCcw size={16} aria-hidden="true" />
            Reset All Data
          </Button>
        </div>

        <input
          ref={inputRef}
          className="hidden"
          type="file"
          accept="application/json,.json"
          onChange={handleImport}
        />
      </div>
    </Card>
  );
}
