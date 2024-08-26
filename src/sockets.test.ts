import { extractLiveUpdateBlock, type LiveUpdateBlock } from "./sockets.js";
import { test, expect, describe } from "vitest";

describe("extractLiveUpdateBlock", () => {
  test("case-1", () => {
    const data = {
      title: "#2 - simple chapter with link",
      image:
        "https://media.rssblue.com/podcasts/rss-blue-podcast/cover-art.rssblue-square.png",
      link: {
        url: "https://example.com",
      },
      value: {
        model: {
          type: "lightning",
          method: "keysend",
        },
        type: "lightning",
        method: "keysend",
        destinations: [
          {
            name: "Dovydas",
            address:
              "030a58b8653d32b99200a2334cfe913e51dc7d155aa0116c176657a4f1722677a3",
            customKey: "696969",
            customValue: "4JKu621Pe89nNdP0G4ah",
            split: 49,
            fee: false,
          },
          {
            name: "RSS Blue",
            address:
              "030a58b8653d32b99200a2334cfe913e51dc7d155aa0116c176657a4f1722677a3",
            customKey: "696969",
            customValue: "JNhG48KDpK6UH6AjmhhJ",
            split: 1,
            fee: false,
          },
        ],
      },
      type: "chapter",
      blockGuid: "e9be919d-8f3f-4a92-88d2-4c0cb008c340",
    };
    const result = extractLiveUpdateBlock(data);
    const expected = {
      title: "#2 - simple chapter with link",
      image:
        "https://media.rssblue.com/podcasts/rss-blue-podcast/cover-art.rssblue-square.png",
      description: null,
      feedGuid: null,
      itemGuid: null,
      value: {
        destinations: [
          {
            name: "Dovydas",
            address:
              "030a58b8653d32b99200a2334cfe913e51dc7d155aa0116c176657a4f1722677a3",
            customKey: "696969",
            customValue: "4JKu621Pe89nNdP0G4ah",
            split: 49,
            fee: false,
          },
          {
            name: "RSS Blue",
            address:
              "030a58b8653d32b99200a2334cfe913e51dc7d155aa0116c176657a4f1722677a3",
            customKey: "696969",
            customValue: "JNhG48KDpK6UH6AjmhhJ",
            split: 1,
            fee: false,
          },
        ],
      },
    } as LiveUpdateBlock;
    expect(result).toEqual(expected);
  });
  test("case-2", () => {
    const data = {
      title: "Chapter",
    };
    const result = extractLiveUpdateBlock(data);
    const expected = {
      title: "Chapter",
      image: null,
      description: null,
      feedGuid: null,
      itemGuid: null,
      value: {
        destinations: [],
      },
    } as LiveUpdateBlock;
    expect(result).toEqual(expected);
  });
  test("case-3", () => {
    const data = {
      "my-title": "Chapter",
    };
    const result = extractLiveUpdateBlock(data);
    const expected = null;
    expect(result).toEqual(expected);
  });
  test("case-4", () => {
    const data = {
      title: "Chapter",
      feedGuid: "cb28401c-716a-51df-8de5-e90527546a12",
    };
    const result = extractLiveUpdateBlock(data);
    const expected = {
      title: "Chapter",
      image: null,
      description: null,
      feedGuid: "cb28401c-716a-51df-8de5-e90527546a12",
      itemGuid: null,
      value: {
        destinations: [],
      },
    } as LiveUpdateBlock;
    expect(result).toEqual(expected);
  });
  test("case-5", () => {
    const data = {
      title: "Chapter",
      // Wrong UUID format:
      feedGuid: "cb28401c-716a-a1df-8de5-e90527546a12",
    };
    const result = extractLiveUpdateBlock(data);
    const expected = {
      title: "Chapter",
      image: null,
      description: null,
      feedGuid: null,
      itemGuid: null,
      value: {
        destinations: [],
      },
    } as LiveUpdateBlock;
    expect(result).toEqual(expected);
  });
  test("case-6", () => {
    const data = {
      title: "Chapter",
      image: 123,
      value: "string",
    };
    const result = extractLiveUpdateBlock(data);
    const expected = {
      title: "Chapter",
      image: "123",
      description: null,
      feedGuid: null,
      itemGuid: null,
      value: {
        destinations: [],
      },
    } as LiveUpdateBlock;
    expect(result).toEqual(expected);
  });
});
