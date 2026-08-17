export interface PersonaSelectionState {
  selection: string;
  explicit: boolean;
}

export interface PersonaSnapshotState {
  persona?: string;
  personaExplicit?: boolean;
}

export function personaFieldsForTurn(
  state: PersonaSelectionState,
): { persona?: string } {
  return state.explicit ? { persona: state.selection } : {};
}

export function personaSelectionFromSessionEvent(event: {
  type?: string;
  metadata?: Record<string, unknown>;
}): string | undefined {
  const persona = event.metadata?.persona;
  return typeof persona === "string" ? persona : undefined;
}

export function personaSnapshotFields(
  snapshot: PersonaSnapshotState,
): { persona?: string } {
  return snapshot.personaExplicit === true
    ? { persona: typeof snapshot.persona === "string" ? snapshot.persona : "" }
    : {};
}

export function personaReplaySelection(
  snapshot: PersonaSnapshotState | undefined,
  perCallPersona: string | undefined,
  session: PersonaSelectionState,
): PersonaSelectionState {
  if (snapshot?.personaExplicit === true) {
    return {
      selection: typeof snapshot.persona === "string" ? snapshot.persona : "",
      explicit: true,
    };
  }
  if (perCallPersona !== undefined) {
    return { selection: perCallPersona, explicit: true };
  }
  return session;
}

export function sessionPersonaUpdateFromEvent(
  fallbackKey: string,
  event: { type?: string; metadata?: Record<string, unknown>; session_id?: string },
): { key: string; persona: string } | undefined {
  const persona = personaSelectionFromSessionEvent(event);
  if (persona === undefined) return undefined;
  const metadataSessionId = event.metadata?.session_id;
  return {
    key:
      (typeof metadataSessionId === "string" && metadataSessionId) ||
      event.session_id ||
      fallbackKey,
    persona,
  };
}
