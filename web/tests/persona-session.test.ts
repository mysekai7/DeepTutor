import test from "node:test";
import assert from "node:assert/strict";
import {
  personaFieldsForTurn,
  personaSelectionFromSessionEvent,
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
