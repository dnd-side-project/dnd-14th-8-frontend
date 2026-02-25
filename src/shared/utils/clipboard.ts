export async function copyTextToClipboard(text: string): Promise<boolean> {
  if (!window.isSecureContext || !navigator.clipboard?.writeText) {
    return false;
  }

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
