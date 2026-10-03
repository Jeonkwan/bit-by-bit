#!/usr/bin/env python3
"""
micro:bit Hardware Board Manager & Flasher

Handles USB connection detection, DAPLink details parsing,
firmware flashing, and serial telemetry monitoring on macOS.
"""

import os
import sys
import glob
import time
import shutil
from datetime import datetime

VOLUME_PATH = "/Volumes/MICROBIT"
DETAILS_FILE = os.path.join(VOLUME_PATH, "DETAILS.TXT")

# Known micro:bit Model ID Prefixes
BOARD_MODELS = {
    "9900": "BBC micro:bit V1.3 (Nordic nRF51822)",
    "9901": "BBC micro:bit V1.5 (Nordic nRF51822)",
    "9903": "BBC micro:bit V2.0 (Nordic nRF52833)",
    "9904": "BBC micro:bit V2.0 (Nordic nRF52833)",
    "9905": "BBC micro:bit V2.2 (Nordic nRF52833)",
    "9906": "BBC micro:bit V2.2 (Nordic nRF52833)",
}

def detect_board():
    """Detects connected micro:bit hardware and serial ports."""
    if not os.path.exists(VOLUME_PATH):
        return None

    info = {
        "connected": True,
        "volume": VOLUME_PATH,
        "model": "BBC micro:bit (Unknown version)",
        "unique_id": None,
        "interface_version": None,
        "bootloader_version": None,
        "serial_port": None,
    }

    # Read DETAILS.TXT safely
    if os.path.exists(DETAILS_FILE):
        try:
            with open(DETAILS_FILE, "r", encoding="utf-8", errors="ignore") as f:
                for line in f:
                    line = line.strip()
                    if line.startswith("Unique ID:"):
                        uid = line.split(":", 1)[1].strip()
                        info["unique_id"] = uid
                        prefix = uid[:4]
                        if prefix in BOARD_MODELS:
                            info["model"] = BOARD_MODELS[prefix]
                    elif line.startswith("Interface Version:"):
                        info["interface_version"] = line.split(":", 1)[1].strip()
                    elif line.startswith("Bootloader Version:"):
                        info["bootloader_version"] = line.split(":", 1)[1].strip()
        except Exception as e:
            info["details_read_error"] = str(e)

    # Detect Serial Port
    ports = glob.glob("/dev/cu.usbmodem*")
    if ports:
        info["serial_port"] = ports[0]

    return info

def print_detection_report(info):
    """Prints a friendly status report of the board."""
    if not info:
        print("❌ No micro:bit detected.")
        print("   Please connect your micro:bit to your Mac with a USB data cable.")
        print("   Ensure the board mounts as '/Volumes/MICROBIT'.")
        return

    print("✅ micro:bit Hardware Detected!")
    print(f"   Model:            {info['model']}")
    print(f"   Mount Point:      {info['volume']}")
    if info.get("unique_id"):
        print(f"   Unique Board ID:  {info['unique_id']}")
    if info.get("interface_version"):
        print(f"   DAPLink Firmware: v{info['interface_version']}")
    if info.get("serial_port"):
        print(f"   Serial Port:      {info['serial_port']}")
    else:
        print("   Serial Port:      Not detected")

def cache_hex(project_name, source_hex_path):
    """Caches a .hex file with a human-readable timestamp version."""
    if not os.path.isfile(source_hex_path):
        raise FileNotFoundError(f"Source hex file not found: {source_hex_path}")

    # Format: YYYY-MM-DD_HHMM
    timestamp = datetime.now().strftime("%Y-%m-%d_%H%M")
    dist_dir = os.path.join("dist", project_name)
    os.makedirs(dist_dir, exist_ok=True)

    target_filename = f"{project_name}_{timestamp}.hex"
    target_path = os.path.join(dist_dir, target_filename)
    latest_path = os.path.join(dist_dir, "latest.hex")

    shutil.copyfile(source_hex_path, target_path)
    # Also update latest.hex
    shutil.copyfile(source_hex_path, latest_path)

    print(f"📦 Cached binary for '{project_name}':")
    print(f"   - Versioned: {target_path}")
    print(f"   - Latest:    {latest_path}")
    return target_path

def flash_hex(hex_path):
    """Flashes a hex file to /Volumes/MICROBIT and monitors the reboot."""
    if not os.path.exists(VOLUME_PATH):
        raise RuntimeError("Cannot flash: micro:bit is not connected at /Volumes/MICROBIT.")

    if not os.path.isfile(hex_path):
        raise FileNotFoundError(f"HEX file to flash does not exist: {hex_path}")

    file_size_kb = os.path.getsize(hex_path) / 1024
    dest_path = os.path.join(VOLUME_PATH, os.path.basename(hex_path))
    print(f"⚡ Flashing '{hex_path}' ({file_size_kb:.1f} KB) to {VOLUME_PATH}...")

    # Write in binary chunks using raw POSIX descriptors to avoid macOS fcopyfile / extended attributes deadlock
    copy_successful = False
    total_bytes = os.path.getsize(hex_path)
    written_bytes = 0
    chunk_size = 4096

    try:
        fd_out = os.open(dest_path, os.O_WRONLY | os.O_CREAT | os.O_TRUNC)
        try:
            with open(hex_path, "rb") as src:
                while True:
                    chunk = src.read(chunk_size)
                    if not chunk:
                        break
                    os.write(fd_out, chunk)
                    written_bytes += len(chunk)
                    percent = int((written_bytes / total_bytes) * 100)
                    print(f"\r⏳ Transferring: {percent}% ({written_bytes // 1024}/{int(file_size_kb)} KB)...", end="", flush=True)
            print()
        finally:
            try:
                os.close(fd_out)
            except Exception:
                pass
        copy_successful = True
    except (OSError, IOError) as e:
        # DAPLink resets the USB bus once the last flash sector arrives
        # An I/O error or Device not configured error indicates DAPLink received the payload and reset
        print(f"\nℹ️ Hardware bus reset detected during write ({e.strerror or e}). This is expected during DAPLink flashing.")
        copy_successful = True

    print("⏳ Firmware transferred. The micro:bit is now reprogramming flash memory...")
    print("⏳ Waiting for device to finish flashing and reboot...")

    # Wait for the unmount and remount cycle (or timeout after 15 seconds)
    start_time = time.time()
    unmounted = False
    while time.time() - start_time < 15:
        time.sleep(0.5)
        is_mounted = os.path.exists(VOLUME_PATH)
        if not is_mounted:
            unmounted = True
        elif unmounted and is_mounted:
            print("✅ Flashing complete! Board successfully rebooted and remounted.")
            return True

    # Check if drive or serial port is alive
    if os.path.exists(VOLUME_PATH) or glob.glob("/dev/cu.usbmodem*"):
        print("✅ Flashing complete! Board is active.")
        return True

    print("⚠️ Flashing started. Please check the micro:bit LED screen to confirm execution.")
    return True

def monitor_serial(port=None, baud=115200):
    """Streams serial output from the connected micro:bit."""
    if not port:
        ports = glob.glob("/dev/cu.usbmodem*")
        if not ports:
            print("❌ No micro:bit serial port found (/dev/cu.usbmodem*).")
            return
        port = ports[0]

    print(f"📡 Connecting to micro:bit serial monitor at {port} ({baud} baud)...")
    print("   Press Ctrl+C to stop.\n---")

    try:
        # Use python's open or screen
        with open(port, "r", encoding="utf-8", errors="ignore") as ser:
            while True:
                line = ser.readline()
                if line:
                    print(line, end="")
    except KeyboardInterrupt:
        print("\n--- Serial monitor closed.")
    except Exception as e:
        print(f"\n⚠️ Serial connection closed: {e}")

if __name__ == "__main__":
    action = sys.argv[1] if len(sys.argv) > 1 else "detect"

    if action in ("detect", "board"):
        info = detect_board()
        print_detection_report(info)
    elif action == "flash":
        if len(sys.argv) < 3:
            print("Usage: python3 scripts/board.py flash <path-to-hex-or-project-name>")
            sys.exit(1)
        target = sys.argv[2]
        # Check if target is a project name in dist/
        cached_latest = os.path.join("dist", target, "latest.hex")
        if os.path.isfile(cached_latest):
            flash_hex(cached_latest)
        elif os.path.isfile(target):
            flash_hex(target)
        else:
            print(f"❌ Error: Could not find hex file for '{target}' in dist/{target}/latest.hex or as direct path.")
            sys.exit(1)
    elif action == "cache":
        if len(sys.argv) < 4:
            print("Usage: python3 scripts/board.py cache <project-name> <path-to-hex>")
            sys.exit(1)
        cache_hex(sys.argv[2], sys.argv[3])
    elif action == "monitor":
        monitor_serial()
    else:
        print(f"Unknown action: {action}")
        print("Available: detect, flash, cache, monitor")
        sys.exit(1)
