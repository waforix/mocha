export enum ActivityFlag {
  INSTANCE = 1 << 0,
  JOIN = 1 << 1,
  /**
   * @deprecated
   */
  SPECTATE = 1 << 2,
  SYNC = 1 << 4,
  PLAY = 1 << 5,
  PARTY_PRIVACY_FRIENDS = 1 << 6,
  PARTY_PRIVACY_VOICE_CHANNEL = 1 << 7,
  EMBEDDED = 1 << 8,
  CONTEXTLESS = 1 << 9,
}
