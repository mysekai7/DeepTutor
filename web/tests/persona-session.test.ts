import test from "node:test";
import assert from "node:assert/strict";
import {
  personaFieldsForTurn,
  personaReplaySelection,
  personaSelectionFromSessionEvent,
  personaSnapshotFields,
  sessionPersonaUpdateFromEvent,
} from "../lib/persona-session";

test("untouched new draft omits persona from the turn wire payload", () => {
  assert.deepEqual(
    personaFieldsForTurn({ selection: "", explicit: false }),
    {},
  );
});

test("explicit no-persona choice includes an empty persona", () => {
  assert.deepEqual(
    personaFieldsForTurn({ selection: "", explicit: true }),
    { persona: "" },
  );
});

test("explicit persona choice includes its name", () => {
  assert.deepEqual(
    personaFieldsForTurn({ selection: "socratic", explicit: true }),
    { persona: "socratic" },
  );
});

test("session event exposes the backend-resolved persona for immediate UI sync", () => {
  assert.equal(
    personaSelectionFromSessionEvent({
      type: "session",
      metadata: { persona: "configured-tutor" },
    }),
    "configured-tutor",
  );
  assert.equal(
    personaSelectionFromSessionEvent({
      type: "session",
      metadata: { persona: "" },
    }),
    "",
  );
  assert.equal(
    personaSelectionFromSessionEvent({ type: "session", metadata: {} }),
    undefined,
  );
});

test("persisted persona snapshot retains omitted, explicit clear, and explicit name", () => {
  assert.deepEqual(personaSnapshotFields({}), {});
  assert.deepEqual(
    personaSnapshotFields({ persona: "", personaExplicit: true }),
    { persona: "" },
  );
  assert.deepEqual(
    personaSnapshotFields({ persona: "teacher", personaExplicit: true }),
    { persona: "teacher" },
  );
});

test("replay explicit clear wins over the current session preference", () => {
  assert.deepEqual(
    personaReplaySelection(
      { persona: "", personaExplicit: true },
      undefined,
      { selection: "stored-teacher", explicit: true },
    ),
    { selection: "", explicit: true },
  );
});

test("session persona event targets its concrete session, not another selected session", () => {
  assert.deepEqual(
    sessionPersonaUpdateFromEvent("draft-1", {
      type: "session",
      metadata: { session_id: "session-a", persona: "teacher" },
    }),
    { key: "session-a", persona: "teacher" },
  );
});
