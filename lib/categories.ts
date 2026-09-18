import { getItem, setItem } from "@/lib/storage";

const CUSTOM_CATEGORIES_KEY = "custom_categories";

/**
 * Built-in categories. Lives here (in the module, not the component) so the
 * component can import it without creating a import cycle
 * component -> lib -> component.
 */
export const DEFAULT_CATEGORIES = [
  "Food",
  "Transport",
  "Education",
  "Rent",
  "Utilities",
  "Health",
  "Shopping",
  "Entertainment",
  "Savings",
  "Work",
  "Gift",
  "Other",
];

/**
 * The Goal Flow API has no categories resource — `category` is a free-text
 * string on transactions and targets. So custom categories are kept locally on
 * the device and offered everywhere a category is chosen.
 */
export async function getCustomCategories(): Promise<string[]> {
  const raw = await getItem(CUSTOM_CATEGORIES_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as string[]) : [];
  } catch {
    return [];
  }
}

export async function getAllCategories(): Promise<string[]> {
  const custom = await getCustomCategories();
  const merged = [...DEFAULT_CATEGORIES];
  custom.forEach((item) => {
    if (
      !merged.some((existing) => existing.toLowerCase() === item.toLowerCase())
    ) {
      merged.push(item);
    }
  });
  return merged;
}

export async function addCustomCategory(name: string): Promise<string[]> {
  const trimmed = name.trim();
  const custom = await getCustomCategories();
  const exists =
    DEFAULT_CATEGORIES.some(
      (item) => item.toLowerCase() === trimmed.toLowerCase(),
    ) || custom.some((item) => item.toLowerCase() === trimmed.toLowerCase());

  if (exists) {
    throw new Error(`"${trimmed}" is already one of your categories.`);
  }

  const next = [...custom, trimmed];
  await setItem(CUSTOM_CATEGORIES_KEY, JSON.stringify(next));
  return next;
}

export async function removeCustomCategory(name: string): Promise<string[]> {
  const custom = await getCustomCategories();
  const next = custom.filter((item) => item !== name);
  await setItem(CUSTOM_CATEGORIES_KEY, JSON.stringify(next));
  return next;
}
