import { readAppData, resetAppData, writeAppData } from "../../lib/storage/appStorage.js";

const BACKUP_APP_NAME = "Credit Card Tracker";
const SUPPORTED_SCHEMA_VERSION = 1;

export function exportBackup() {
  const appData = readAppData();
  const backup = {
    meta: {
      appName: BACKUP_APP_NAME,
      schemaVersion: SUPPORTED_SCHEMA_VERSION,
      exportedAt: new Date().toISOString(),
    },
    data: appData,
  };

  const blob = new Blob([JSON.stringify(backup, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `finance-tracker-backup-${getDateStamp()}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);

  return {
    ok: true,
    message: "Backup exported successfully.",
  };
}

export async function importBackupFile(file) {
  if (!file) {
    return {
      ok: false,
      message: "Choose a JSON backup file first.",
    };
  }

  if (file.type && file.type !== "application/json") {
    return {
      ok: false,
      message: "Backup file must be a JSON file.",
    };
  }

  try {
    const parsed = JSON.parse(await file.text());
    const validation = validateBackup(parsed);

    if (!validation.ok) {
      return validation;
    }

    return {
      ok: true,
      message: "Backup imported successfully.",
      data: writeAppData(validation.data),
    };
  } catch {
    return {
      ok: false,
      message: "Could not read that backup. Make sure it is valid JSON.",
    };
  }
}

export function resetAllData() {
  return {
    ok: true,
    message: "All local data has been reset.",
    data: resetAppData(),
  };
}

function validateBackup(backup) {
  if (!backup || typeof backup !== "object") {
    return invalid("Backup must be a JSON object.");
  }

  if (!backup.meta || typeof backup.meta !== "object") {
    return invalid("Backup is missing metadata.");
  }

  if (backup.meta.schemaVersion !== SUPPORTED_SCHEMA_VERSION) {
    return invalid("Backup schema version is not supported.");
  }

  if (!backup.data || typeof backup.data !== "object") {
    return invalid("Backup is missing app data.");
  }

  const data = backup.data;

  if (!data.meta || typeof data.meta !== "object") {
    return invalid("Backup app data is missing metadata.");
  }

  if (data.meta.schemaVersion !== SUPPORTED_SCHEMA_VERSION) {
    return invalid("App data schema version is not supported.");
  }

  if (!Array.isArray(data.creditCards)) {
    return invalid("Backup credit cards must be an array.");
  }

  if (!data.monthlyBalances || typeof data.monthlyBalances !== "object" || Array.isArray(data.monthlyBalances)) {
    return invalid("Backup monthly balances must be an object.");
  }

  if (!data.budgetsByMonth) {
    data.budgetsByMonth = {};
  }

  if (typeof data.budgetsByMonth !== "object" || Array.isArray(data.budgetsByMonth)) {
    return invalid("Backup monthly budgets must be an object.");
  }

  const invalidCard = data.creditCards.find((card) => !isValidCreditCard(card));
  if (invalidCard) {
    return invalid("Backup contains an invalid credit card record.");
  }

  if (!areMonthlyBalancesValid(data.monthlyBalances, data.creditCards)) {
    return invalid("Backup contains invalid monthly balance records.");
  }

  if (!areBudgetsValid(data.budgetsByMonth)) {
    return invalid("Backup contains invalid budget records.");
  }

  return {
    ok: true,
    message: "Backup is valid.",
    data,
  };
}

function areBudgetsValid(budgetsByMonth) {
  return Object.entries(budgetsByMonth).every(([monthKey, budgets]) => {
    if (!/^\d{4}-\d{2}$/.test(monthKey)) return false;
    if (!Array.isArray(budgets)) return false;

    return budgets.every((budget) => {
      return (
        budget &&
        typeof budget === "object" &&
        typeof budget.id === "string" &&
        typeof budget.name === "string" &&
        Number.isFinite(Number(budget.monthlyAmount)) &&
        Number(budget.monthlyAmount) >= 0 &&
        typeof budget.notes === "string"
      );
    });
  });
}

function isValidCreditCard(card) {
  return (
    card &&
    typeof card === "object" &&
    typeof card.id === "string" &&
    typeof card.name === "string" &&
    typeof card.url === "string" &&
    typeof card.network === "string" &&
    typeof card.owner === "string" &&
    typeof card.lastFour === "string" &&
    Number.isFinite(Number(card.creditLimit)) &&
    Number.isFinite(Number(card.dueDay)) &&
    Number(card.dueDay) >= 1 &&
    Number(card.dueDay) <= 31
  );
}

function areMonthlyBalancesValid(monthlyBalances, creditCards) {
  const cardIds = new Set(creditCards.map((card) => card.id));

  return Object.entries(monthlyBalances).every(([monthKey, balances]) => {
    if (!/^\d{4}-\d{2}$/.test(monthKey)) return false;
    if (!balances || typeof balances !== "object" || Array.isArray(balances)) return false;

    return Object.entries(balances).every(([cardId, entry]) => {
      return (
        cardIds.has(cardId) &&
        entry &&
        typeof entry === "object" &&
        Number.isFinite(Number(entry.balance)) &&
        typeof entry.paid === "boolean"
      );
    });
  });
}

function invalid(message) {
  return {
    ok: false,
    message,
  };
}

function getDateStamp() {
  const today = new Date();
  return [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");
}
