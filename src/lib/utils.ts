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
