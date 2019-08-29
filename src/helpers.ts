export function markAsCreator(obj: any): void {
  obj.__creator__ = true;
}

export function isCreator(obj: any): boolean {
  return obj!.__creator__;
}

export function markAsRaw(obj: any): void {
  obj.__isRaw__ = true;
}

export function markAsProcessed(obj: any, originalRaw: any): void {
  obj.__isRaw__ = false;
  obj.__originalRaw__ = originalRaw;
}

export function getOriginalRaw(obj: any): any {
  return obj.__originalRaw__;
}

export function isRaw(obj: any): boolean {
  return obj!.__isRaw__;
}

export function injectMappers(obj: any, mappers: any[]) {
  obj.__mappers__ = mappers;
}

export function getMappers(obj: any): Array<(action: any) => any> {
  return obj!.__mappers__ || [];
}

export function setTypeFlags(obj: any, hasPayload: boolean, hasMeta: boolean) {
  obj.__hasPayload__ = hasPayload;
  obj.__hasMeta__ = hasMeta;
}

export function hasPayload(obj: any): boolean {
  return obj!.__hasPayload__;
}

export function hasMeta(obj: any): boolean {
  return obj!.__hasMeta__;
}

export function isPropertyForcedPrefix(name: string) {
  return '__forcedPrefix__' === name;
}

export function setForcedPrefix(obj: any, prefix: string) {
  obj.__forcedPrefix__ = prefix;
}

export function getForcedPrefix(obj: any): string {
  return obj!.__forcedPrefix__ || '';
}
