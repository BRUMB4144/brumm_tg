const STATE = {
  IDLE: null,
  WAITING_FOR_TEXT: 'waiting_for_text',
  WAITING_FOR_VIDEO: 'waiting_for_video',
  WAITING_FOR_BUTTON: 'waiting_for_button',
  PREVIEW: 'preview',
  BROADCASTING: 'broadcasting'
};

/**
 * Черновики рассылок по чатам администраторов.
 * Хранятся в памяти процесса: незавершённый черновик теряется при рестарте.
 */
class BroadcastDraftStore {
  #drafts = new Map();

  get(chatId) {
    if (!this.#drafts.has(chatId)) {
      this.#drafts.set(chatId, { state: STATE.IDLE, text: null, video: null, withButton: false });
    }
    return this.#drafts.get(chatId);
  }

  reset(chatId) {
    this.#drafts.delete(chatId);
    return this.get(chatId);
  }
}

module.exports = { STATE, BroadcastDraftStore };
