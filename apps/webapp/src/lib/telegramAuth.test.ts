import { describe, expect, it, vi } from "vitest";
import { buildTelegramLoginPayload, persistTelegramSession } from "./telegramAuth";

describe("Telegram authentication", () => {
  it("uses signed initData and Telegram user identity", () => {
    const payload = buildTelegramLoginPayload(
      { initData: "signed", openTelegramLink: vi.fn(), shareToStory: vi.fn() },
      { id: 42, first_name: "Alex", photo_url: "avatar" },
    );
    expect(payload).toEqual({
      initData: "signed",
      telegramId: 42,
      avatar: "avatar",
      username: "Alex",
    });
  });

  it("persists all tokens returned by gusev_new", () => {
    const setItem = vi.fn();
    persistTelegramSession(
      { userId: "u1", accessToken: "access", refreshToken: "refresh", telegramId: "42" },
      { setItem },
    );
    expect(setItem.mock.calls).toEqual([
      ["id", "u1"],
      ["accessToken", "access"],
      ["refreshToken", "refresh"],
      ["telegramId", "42"],
    ]);
  });
});
