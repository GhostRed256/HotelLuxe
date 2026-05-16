export function serializeFirestoreData(data: any) {
  if (!data) return data;

  const serialized = { ...data };

  for (const key in serialized) {
    const value = serialized[key];
    
    // Check for Firestore Timestamp (objects with toDate method)
    if (value && typeof value === 'object' && 'toDate' in value && typeof value.toDate === 'function') {
      serialized[key] = value.toDate().toISOString();
    } 
    // Recursively serialize objects and arrays
    else if (Array.isArray(value)) {
      serialized[key] = value.map(item => typeof item === 'object' ? serializeFirestoreData(item) : item);
    }
    else if (value && typeof value === 'object') {
      serialized[key] = serializeFirestoreData(value);
    }
  }

  return serialized;
}

/**
 * Normalizes user input (phone or email) into the internal storage format.
 * If 10 digits are provided, it assumes +91 and appends @staynjoy.com
 */
export function normalizeGuestIdentifier(input: string) {
  if (!input) return "";
  const trimmed = input.trim();
  
  // If it's already an email, just lowercase it
  if (trimmed.includes("@")) return trimmed.toLowerCase();
  
  // Strip all non-digits for phone processing
  const digits = trimmed.replace(/\D/g, "");
  
  // Handle 10-digit Indian numbers
  if (digits.length === 10) {
    return `+91${digits}@staynjoy.com`;
  }
  
  // Handle 12-digit numbers starting with 91
  if (digits.length === 12 && digits.startsWith("91")) {
    return `+${digits}@staynjoy.com`;
  }

  // Fallback: if it's already a full international number with +
  if (trimmed.startsWith("+") && trimmed.length > 10) {
    return `${trimmed.toLowerCase()}@staynjoy.com`;
  }

  return trimmed.toLowerCase();
}

/**
 * Cleans up internal identifiers for display in the UI.
 * Strips @staynjoy.com and optionally +91 for a cleaner look.
 */
export function formatGuestIdentifierForDisplay(identifier: string) {
  if (!identifier) return "";
  
  // Remove the internal domain
  let display = identifier.replace("@staynjoy.com", "");
  
  // If it's our internal phone-email format, we can optionally strip +91
  // but let's keep it consistent with what the user expects.
  // The user specifically asked to "remove @staynjoy.com" and "remove +91 while logging in"
  if (identifier.endsWith("@staynjoy.com")) {
    display = display.replace("+91", "");
  }
  
  return display;
}
