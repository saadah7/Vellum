#!/usr/bin/env python3
"""
Ingest knowledge base spec files into ChromaDB.

Run from the project root:
    python scripts/ingest.py

Re-run whenever files in data/ are added or modified.
"""

import sys
import time
from pathlib import Path

# Ensure project root is on the path when run as a script
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from core.knowledge import ingest_data


def main() -> None:
    print("Vellum — Knowledge Base Ingestion")
    print("=" * 36)
    start = time.perf_counter()

    try:
        ingest_data()
        elapsed = time.perf_counter() - start
        print(f"\n✓ Done in {elapsed:.1f}s")
    except Exception as exc:
        print(f"\n✗ Ingestion failed: {exc}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
