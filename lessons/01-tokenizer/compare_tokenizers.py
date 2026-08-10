"""Compare byte, Unicode character, and trained BPE tokenizers."""

from __future__ import annotations

import argparse
from collections.abc import Iterable

import tiktoken


ENCODING_NAMES = ("r50k_base", "cl100k_base", "o200k_base")

DEFAULT_SAMPLES = (
    "你好，世界！",
    "Agent calls tools.",
    'fmt.Println("你好")',
    "语音 Agent 🎙️",
    "生僻字：龘",
)


def visible_piece(raw: bytes) -> str:
    """Render a token as text, or as bytes when it is incomplete UTF-8."""
    try:
        return repr(raw.decode("utf-8"))
    except UnicodeDecodeError:
        return f"<bytes {raw.hex(' ')}>"


def print_baselines(text: str) -> None:
    byte_tokens = list(text.encode("utf-8"))
    rune_tokens = list(text)

    print(f"  {'UTF-8 bytes':<12} {len(byte_tokens):>3} tokens")
    print("    split: " + " | ".join(f"0x{value:02x}" for value in byte_tokens))

    print(f"  {'Unicode chars':<12} {len(rune_tokens):>3} tokens")
    print("    split: " + " | ".join(repr(char) for char in rune_tokens))


def print_bpe(
    text: str,
    encoding_name: str,
    details: bool,
) -> None:
    encoding = tiktoken.get_encoding(encoding_name)
    token_ids = encoding.encode(text)
    token_bytes = [encoding.decode_single_token_bytes(token_id) for token_id in token_ids]

    assert encoding.decode(token_ids) == text
    print(f"  {encoding_name:<12} {len(token_ids):>3} tokens")
    print("    split: " + " | ".join(visible_piece(raw) for raw in token_bytes))

    if not details:
        return

    for index, (token_id, raw) in enumerate(zip(token_ids, token_bytes, strict=True)):
        print(
            f"    #{index:<2} id={token_id:<7} "
            f"text={visible_piece(raw):<20} bytes={raw.hex(' ')}"
        )


def compare(texts: Iterable[str], details: bool) -> None:
    for text in texts:
        print(f"\nInput: {text!r}")
        print_baselines(text)
        for encoding_name in ENCODING_NAMES:
            print_bpe(text, encoding_name, details)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Compare the same text under byte, character, and BPE tokenizers."
    )
    parser.add_argument(
        "--text",
        action="append",
        help="Text to compare. Repeat this option for multiple inputs.",
    )
    parser.add_argument(
        "--details",
        action="store_true",
        help="Also show every token ID and its byte sequence.",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    compare(args.text or DEFAULT_SAMPLES, args.details)


if __name__ == "__main__":
    main()
