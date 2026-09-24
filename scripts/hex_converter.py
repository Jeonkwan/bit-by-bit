#!/usr/bin/env python3
"""
MakeCode Universal HEX Source Code Extractor & Rollback Manager

Reverses MakeCode Intel HEX files back into original TypeScript source code,
storing extracted files in a dedicated 'rollbacks/<project>_<timestamp>/' directory.
"""

import os
import sys
import json
import struct
import lzma
from datetime import datetime

# Microsoft PXT Source Embedding Magic Header: "\x41\x14\x0E\x2F\xB8\x2F\xA2\xBB"
PXT_MAGIC = b"\x41\x14\x0E\x2F\xB8\x2F\xA2\xBB"

def parse_intel_hex(hex_path):
    """
    Parses an Intel HEX file, collecting both raw binary flash data
    and custom 0x0D PXT records.
    """
    custom_records = bytearray()
    raw_flash_bytes = bytearray()

    with open(hex_path, "r", encoding="ascii", errors="ignore") as f:
        for line in f:
            line = line.strip()
            if not line.startswith(":"):
                continue
            try:
                byte_len = int(line[1:3], 16)
                rec_type = int(line[7:9], 16)
                data_hex = line[9 : 9 + byte_len * 2]
                record_data = bytes.fromhex(data_hex)

                if rec_type == 0x0D:  # PXT Custom Data Record
                    custom_records.extend(record_data)
                elif rec_type == 0x00:  # Normal Data Record
                    raw_flash_bytes.extend(record_data)
            except ValueError:
                continue

    return bytes(custom_records), bytes(raw_flash_bytes)

def extract_source_from_bytes(data):
    """
    Scans a byte stream for the PXT source embedding magic header,
    reads metadata, and decompresses the embedded project files.
    """
    magic_idx = data.find(PXT_MAGIC)
    if magic_idx == -1:
        return None, None

    header_start = magic_idx
    header_len = struct.unpack("<H", data[header_start + 8 : header_start + 10])[0]
    text_len = struct.unpack("<I", data[header_start + 10 : header_start + 14])[0]

    json_header_start = header_start + 16
    json_header_bytes = data[json_header_start : json_header_start + header_len]

    try:
        header = json.loads(json_header_bytes.decode("utf-8"))
    except Exception as e:
        header = {"raw_header_error": str(e)}

    payload_start = json_header_start + header_len
    payload = data[payload_start : payload_start + text_len]

    # Decompress payload
    decompressed_text = None
    compression = header.get("compression", "LZMA")

    if compression == "LZMA":
        # Try standard lzma decompress first
        try:
            decompressed_text = lzma.decompress(payload, format=lzma.FORMAT_AUTO).decode("utf-8")
        except Exception:
            # Try raw LZMA stream
            try:
                decompressed_text = lzma.decompress(
                    payload,
                    format=lzma.FORMAT_RAW,
                    filters=[{"id": lzma.FILTER_LZMA1}]
                ).decode("utf-8")
            except Exception as e:
                raise RuntimeError(f"Failed to decompress LZMA payload: {e}")
    else:
        decompressed_text = payload.decode("utf-8", errors="ignore")

    # The decompressed text can either be:
    # 1. A JSON object mapping filename -> file contents
    # 2. An additional JSON header followed by text
    try:
        files = json.loads(decompressed_text)
    except json.JSONDecodeError:
        # If headerSize specified in inner payload
        header_size = header.get("headerSize", 0)
        if header_size > 0:
            inner_header = json.loads(decompressed_text[:header_size])
            inner_content = decompressed_text[header_size:]
            files = {"main.ts": inner_content, "pxt.json": json.dumps(inner_header, indent=2)}
        else:
            files = {"main.ts": decompressed_text}

    return header, files

def rollback_hex(hex_path, target_project_name=None):
    """
    Extracts source code from a MakeCode HEX file and stores it in:
    rollbacks/<project_name>_<YYYY-MM-DD_HHMM>/
    """
    if not os.path.isfile(hex_path):
        raise FileNotFoundError(f"HEX file not found: {hex_path}")

    custom_data, raw_flash = parse_intel_hex(hex_path)

    # Search custom 0x0D records first, then fall back to full flash
    header, files = extract_source_from_bytes(custom_data)
    if not files:
        header, files = extract_source_from_bytes(raw_flash)

    if not files:
        raise ValueError(
            "❌ No embedded MakeCode source found in this HEX file.\n"
            "   (Note: Raw machine-code binaries stripped by chip flashers do not contain source metadata)."
        )

    # Determine project name
    project_name = target_project_name
    if not project_name and header and "name" in header:
        project_name = header["name"]
    if not project_name:
        base = os.path.basename(hex_path)
        project_name = os.path.splitext(base)[0].replace("microbit-", "")

    # Clean project name
    project_name = project_name.replace(" ", "-").lower()

    # Generate timestamp version: YYYY-MM-DD_HHMM
    timestamp = datetime.now().strftime("%Y-%m-%d_%H%M")
    rollback_dir = os.path.join("rollbacks", f"{project_name}_{timestamp}")
    os.makedirs(rollback_dir, exist_ok=True)

    # Write extracted files
    saved_files = []
    if isinstance(files, dict):
        for filename, content in files.items():
            out_file = os.path.join(rollback_dir, filename)
            os.makedirs(os.path.dirname(out_file), exist_ok=True)
            with open(out_file, "w", encoding="utf-8") as f:
                f.write(content)
            saved_files.append(filename)
    elif isinstance(files, str):
        out_file = os.path.join(rollback_dir, "main.ts")
        with open(out_file, "w", encoding="utf-8") as f:
            f.write(files)
        saved_files.append("main.ts")

    # Write rollback metadata
    info_meta = {
        "rollback_project": project_name,
        "rollback_timestamp": timestamp,
        "source_hex": os.path.abspath(hex_path),
        "source_hex_size_bytes": os.path.getsize(hex_path),
        "recovered_files": saved_files,
        "makecode_header": header,
    }
    with open(os.path.join(rollback_dir, "rollback_info.json"), "w", encoding="utf-8") as f:
        json.dump(info_meta, f, indent=2)

    print("🎉 Source code successfully recovered from HEX!")
    print(f"📁 Rollback directory: {rollback_dir}")
    print("📄 Recovered files:")
    for fn in saved_files:
        print(f"   - {fn}")

    return rollback_dir

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 scripts/hex_converter.py <path-to-hex> [project-name]")
        sys.exit(1)

    hex_file = sys.argv[1]
    proj_name = sys.argv[2] if len(sys.argv) > 2 else None
    try:
        rollback_hex(hex_file, proj_name)
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)
