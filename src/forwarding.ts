type Action = "boost" | "stream" | "auto";

export interface PaymentInfo {
  // ACTION
  action: Action;

  // FEED IDENTIFIER
  feedGuid: string | null;
  feedName: string | null;
  feedPiId: number | null;
  feedUrl: URL | null;

  // ITEM IDENTIFIER
  itemGuid: string | null;
  itemName: string | null;
  itemPiId: number | null;

  // PLAYBACK INFO
  timestamp: number | null; // Duration in seconds
  speed: number | null;

  // APP INFO
  appName: string | null;
  appVersion: string | null;

  // SENDER INFO
  senderName: string | null;
  senderId: string | null;

  // PAYMENT INFO
  totalNumSats: number;
  message: string | null;
  boostLink: URL | null;
  boostId: string | null;

  // REMOTE INFO
  remoteFeedGuid: string | null;
  remoteItemGuid: string | null;

  // Keysend address of the sender
  replyAddress: KeysendAddress | null;
}

export interface KeysendAddress {
  pubkey: string;
  customData: [string, string] | null;
}

export interface PaymentRecipientInfo {
  // Recipient's keysend address
  address: KeysendAddress;

  // Number of sats to send
  numSats: number;

  // UUID of a payment sent out to a single recipient
  paymentId: string | null;

  // Optional signature for the payment
  paymentSignature: string | null;

  // Recipient's name
  name: string | null;
}
