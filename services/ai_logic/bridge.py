import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.append(str(ROOT))


def main() -> None:
    payload = json.loads(sys.argv[1]) if len(sys.argv) > 1 else {}
    query = payload.get("query", "")
    mode = payload.get("mode", "text")
    category = payload.get("category", "electronics")

    result = {
        "query": query,
        "mode": mode,
        "category": category,
        "deals": [
            {
                "title": "UltraBook Pro 14",
                "seller": "TechNova",
                "price": "$1,149",
                "delivery": "Free 2-day shipping",
                "rating": "4.8/5",
                "badge": "Best overall"
            },
            {
                "title": "GalaxyTab Air",
                "seller": "BrightCart",
                "price": "$879",
                "delivery": "1-day delivery",
                "rating": "4.6/5",
                "badge": "Fastest delivery"
            }
        ]
    }

    print(json.dumps(result))


if __name__ == "__main__":
    main()
