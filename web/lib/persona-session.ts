export interface PersonaSelectionState {
  selection: string;
  explicit: boolean;
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
