import { describe, expect, it } from "vitest";
import { getAuthErrorMessage } from "../authErrors";

describe("getAuthErrorMessage", () => {
  it("traduit un code Firebase connu", () => {
    expect(getAuthErrorMessage({ code: "auth/invalid-credential" })).toBe(
      "Email ou mot de passe incorrect."
    );
  });

  it("renvoie un message générique pour un code inconnu ou une erreur quelconque", () => {
    expect(getAuthErrorMessage({ code: "auth/whatever" })).toMatch(/erreur est survenue/);
    expect(getAuthErrorMessage(new Error("boom"))).toMatch(/erreur est survenue/);
    expect(getAuthErrorMessage(undefined)).toMatch(/erreur est survenue/);
  });
});
