export enum VerificationLevel {
  NONE = 0 /* Unrestricted */,
  LOW = 1 /* Verified email account */,
  MEDIUM = 2 /* Registered on Discord for at least 5 minutes */,
  HIGH = 3 /* Member of the guild for at least 10 minutes */,
  VERY_HIGH = 4 /* Verified phone number */,
}
