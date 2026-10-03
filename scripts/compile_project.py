#!/usr/bin/env python3
"""
MakeCode TypeScript to micro:bit HEX Compiler

Compiles MakeCode Static TypeScript (projects/<project>/main.ts) into
universal Intel HEX binaries for BBC micro:bit V1 & V2 using MakeCode CLI,
and caches the results with timestamp versions in dist/<project>/.
"""

import os
import sys
import shutil
import subprocess
from datetime import datetime

def compile_project(project_name):
    # Normalize project name
    clean_name = os.path.basename(project_name.rstrip("/\\"))
    project_dir = os.path.join("projects", clean_name)
    main_ts = os.path.join(project_dir, "main.ts")

    if not os.path.isfile(main_ts):
        print(f"❌ Error: Could not find '{main_ts}'.")
        print(f"   Ensure projects/{clean_name}/main.ts exists.")
        sys.exit(1)

    print(f"⚙️ Preparing MakeCode build environment for '{clean_name}'...")

    # Build workspace directory
    build_dir = os.path.join(".build", clean_name)
    os.makedirs(build_dir, exist_ok=True)

    # 1. Write MakeCode pxt.json configuration
    pxt_json_content = f"""{{
    "name": "{clean_name}",
    "version": "1.0.0",
    "description": "MakeCode micro:bit project",
    "files": [
        "main.ts"
    ],
    "supportedTargets": [
        "microbit"
    ],
    "dependencies": {{
        "core": "*",
        "radio": "*",
        "microphone": "*"
    }},
    "testDependencies": {{}}
}}
"""
    with open(os.path.join(build_dir, "pxt.json"), "w", encoding="utf-8") as f:
        f.write(pxt_json_content)

    # Write mkc.json pinning the MakeCode target to the stable production web editor (v5)
    mkc_json_content = """{
    "targetWebsite": "https://makecode.microbit.org/v5"
}
"""
    with open(os.path.join(build_dir, "mkc.json"), "w", encoding="utf-8") as f:
        f.write(mkc_json_content)

    # 2. Copy main.ts into build directory
    shutil.copyfile(main_ts, os.path.join(build_dir, "main.ts"))

    # 3. Check for makecode executable
    makecode_cmd = "makecode"
    if not shutil.which(makecode_cmd):
        # Fall back to npx makecode if makecode isn't in global PATH
        makecode_cmd = "npx -y makecode"

    print(f"🔨 Compiling TypeScript to Universal HEX via MakeCode CLI...")
    cmd = f"{makecode_cmd} build"
    result = subprocess.run(
        cmd,
        shell=True,
        cwd=build_dir,
        capture_output=True,
        text=True
    )

    if result.returncode != 0:
        print("❌ Compilation Failed!")
        if result.stdout:
            print(result.stdout)
        if result.stderr:
            print(result.stderr)
        sys.exit(1)

    # 4. Locate binary.hex
    binary_hex = os.path.join(build_dir, "built", "binary.hex")
    if not os.path.isfile(binary_hex):
        print("❌ Error: Build finished but 'built/binary.hex' was not found.")
        sys.exit(1)

    # 5. Cache output to dist/<project>/
    timestamp = datetime.now().strftime("%Y-%m-%d_%H%M")
    dist_dir = os.path.join("dist", clean_name)
    os.makedirs(dist_dir, exist_ok=True)

    versioned_hex = os.path.join(dist_dir, f"{clean_name}_{timestamp}.hex")
    latest_hex = os.path.join(dist_dir, "latest.hex")

    shutil.copyfile(binary_hex, versioned_hex)
    shutil.copyfile(binary_hex, latest_hex)

    file_size_kb = os.path.getsize(latest_hex) / 1024
    print(f"✨ Successfully compiled '{clean_name}' ({file_size_kb:.1f} KB)!")
    print(f"📦 Cached in:")
    print(f"   - {versioned_hex}")
    print(f"   - {latest_hex}")
    print(f"\n🚀 Ready to flash! Run:")
    print(f"   ./run flash {clean_name}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 scripts/compile_project.py <project-name>")
        sys.exit(1)
    compile_project(sys.argv[1])
