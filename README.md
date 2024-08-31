# V4V (TypeScript)

A set of helper functions for dealing with value-for-value (V4V) calculations and transactions.
The functionality is largely duplicated from the [v4v](https://github.com/rssblue/v4v) [Rust](https://www.rust-lang.org) crate.

## All items

### `v4v/calc`

```ts
function computeSatRecipients(splits: number[], totalSats: number): number[];
```

```ts
type ShareBasedRecipient = {
  numShares: number;
};

type PercentageBasedRecipient = {
  percentage: number;
};

type Recipient = ShareBasedRecipient | PercentageBasedRecipient;

enum RecipientsToSplitsError

function feeRecipientsToSplits(
  recipients: Recipient[],
): number[] | RecipientsToSplitsError
```

### `v4v/sockets`

```ts
type LiveUpdateBlock

function extractLiveUpdateBlock(data: any): LiveUpdateBlock | null
```

### `v4v/forwarding`

Types to use with [v4v (Rust)](https://docs.rs/v4v).

```ts
interface PaymentInfo

interface KeysendAddress

interface PaymentRecipientInfo
```

## Examples

### Sat forwarding service using `<podcast:liveItem>` websocket

This assumes the usage of a signal-based framework like SolidJS.

```ts
import QRCode from "qrcode";
import { PaymentInfo, PaymentRecipientInfo } from "v4vts/forwarding";
import { createMemo } from "solid-js";
import { extractLiveUpdateBlock } from "v4vts/sockets";
import { io } from "socket.io-client";
import { v4 as uuid } from "uuid";

...

const socket = io(socketUrl);
socket.on("remoteValue", function(data) {
  const block = extractLiveUpdateBlock(data);
  setRemoteBlock(block);
  if (block !== null && block.value.destinations.length > 0) {
    setRemoteValueDestinations(block.value.destinations);
  } else {
    setRemoteValueDestinations(liveitemInfo.valueDestinations);
  }
});

...

const recipients = createMemo(() => {
  const genericRecipients: GenericRecipient[] = valueDestinations().map((dest) => {
    if (dest.fee) {
      return {
        percentage: dest.split,
      }
    }
    return {
      numShares: dest.split,
    }
  });
  const splits = feeRecipientsToSplits(genericRecipients);
  if (!(splits instanceof Array)) {
    return [];
  }
  const sats = computeSatRecipients(splits, numSats());

  return valueDestinations().map((dest, i) => {
    return {
      name: dest.name,
      address: {
        pubkey: dest.address,
        customData: (() => {
          if (dest.customKey === null || dest.customValue === null) {
            return null;
          }
          return [dest.customKey, dest.customValue];
        })(),
      },
      numSats: sats[i],
      paymentId: uuid(),

    } as PaymentRecipientInfo;
  });
});

...

interface ApiRequest {
  paymentInfo: PaymentInfo;
  recipients: PaymentRecipientInfo[];
}

const onSubmit = async () => {
  setState("fetching");
  const request: ApiRequest = {
    paymentInfo: {
      action: "boost",
      feedGuid: liveitemInfo.feedGuid,
      feedName: liveitemInfo.feedTitle,
      feedPiId: null,
      feedUrl: null,
      itemGuid: liveitemInfo.itemGuid,
      itemName: liveitemInfo.itemTitle,
      itemPiId: null,
      timestamp: null,
      speed: null,
      appName: "lightning.phantompowermusic.io",
      appVersion: null,
      senderName: author(),
      senderId: null,
      totalNumSats: numSats(),
      message: message(),
      boostLink: null,
      boostId: uuid(),
      remoteFeedGuid: remoteItemInfo()[0],
      remoteItemGuid: remoteItemInfo()[1],
      replyAddress: null,
    },
    recipients: recipients(),
  };
  const response = await generateInvoice(request);
  const img = await QRCode.toDataURL(response.invoice, {
    type: "image/png",
    width: 2000,
    // Dark mode:
    color: {
      dark: "#ffffff",
      light: "#080828",
    },
    margin: 1,
  });
  setInvoice({
    str: response.invoice,
    img: img,
  });
  setState("success");
}
```
