import json
import os
import re
import sys
from pathlib import Path
from typing import Dict, List, Tuple

from services.ai_logic.utils.prompt_templates import build_gemini_prompt

ROOT = Path(__file__).resolve().parents[1]
sys.path.append(str(ROOT))


def normalize(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", " ", text.lower()).strip()


def infer_category(query: str, fallback: str) -> str:
    normalized = normalize(query)
    keywords = normalized.split()

    if any(word in keywords for word in ["phone", "smartphone", "iphone", "android", "galaxy"]):
        return "phones"
    if any(word in keywords for word in ["laptop", "notebook", "ultrabook", "macbook", "thinkpad"]):
        return "laptops"
    if any(word in keywords for word in ["headphone", "earbud", "speaker", "audio"]):
        return "audio"
    if any(word in keywords for word in ["watch", "wearable", "fitbit", "smartwatch"]):
        return "wearables"
    if any(word in keywords for word in ["tablet", "ipad", "surface"]):
        return "tablets"
    if any(word in keywords for word in ["camera", "dslr", "lens"]):
        return "cameras"
    return fallback


def build_title(query: str, category: str) -> str:
    words = normalize(query).split()
    if not words:
        words = ["featured"]

    base = " ".join(words[:3]).title()
    category_map = {
        "phones": "Smartphone",
        "laptops": "Laptop",
        "audio": "Headphones",
        "wearables": "Smartwatch",
        "tablets": "Tablet",
        "cameras": "Camera",
    }
    label = category_map.get(category, "Product")
    return f"{base} {label}"


def price_for(category: str, query: str) -> Tuple[int, str]:
    base_prices = {
        "phones": 699,
        "laptops": 899,
        "audio": 129,
        "wearables": 199,
        "tablets": 449,
        "cameras": 549,
    }
    base = base_prices.get(category, 299)

    query_words = normalize(query).split()
    boost = sum(25 for word in query_words if word in ["pro", "plus", "max", "ultra", "premium", "best"])
    discount = 0
    if any(word in query_words for word in ["cheap", "budget", "sale", "offer"]):
        discount = 70

    final_price = max(99, base + boost - discount)
    return final_price, f"${final_price:,}"


def delivery_for(seller: str, category: str) -> str:
    delivery_profiles = {
        "TechNova": "Free 2-day shipping",
        "BrightCart": "1-day delivery",
        "DealHub": "Free standard shipping",
        "PricePilot": "2-day delivery",
        "MarketNest": "Free next-day shipping",
    }
    if seller in delivery_profiles:
        return delivery_profiles[seller]
    return "Free shipping"


def rating_for(seller: str, category: str) -> str:
    ratings = {
        "TechNova": "4.8/5",
        "BrightCart": "4.6/5",
        "DealHub": "4.7/5",
        "PricePilot": "4.4/5",
        "MarketNest": "4.9/5",
    }
    if seller in ratings:
        return ratings[seller]
    return "4.5/5"


def badge_for(price: int, rating: float, category: str) -> str:
    if price < 250:
        return "Best value"
    if rating >= 4.8:
        return "Top rated"
    if category in ["laptops", "phones"]:
        return "Great deal"
    return "Popular pick"


def score_deal(title: str, price: int, rating: float, seller: str, query: str) -> float:
    query_words = normalize(query).split()
    title_words = normalize(title).split()
    keyword_overlap = len(set(query_words) & set(title_words))
    price_score = 1000 / max(price, 1)
    rating_score = rating * 20
    overlap_score = keyword_overlap * 15
    return price_score + rating_score + overlap_score


def generate_deals(payload: Dict[str, str]) -> List[Dict[str, str]]:
    query = payload.get("query", "")
    mode = payload.get("mode", "text")
    category = infer_category(query, payload.get("category", "electronics"))

    seller_pool = ["TechNova", "BrightCart", "DealHub", "PricePilot", "MarketNest"]
    base_title = build_title(query, category)
    deals: List[Dict[str, str]] = []

    for index, seller in enumerate(seller_pool):
        price, price_text = price_for(category, query)
        adjusted_price = price + (index * 30) - (10 if seller == "BrightCart" else 0)
        adjusted_price = max(99, adjusted_price)
        rating_value = 4.4 + (0.1 * index)
        title = base_title if index == 0 else f"{base_title} {index}"
        deal = {
            "title": title,
            "seller": seller,
            "price": f"${adjusted_price:,}",
            "delivery": delivery_for(seller, category),
            "rating": f"{rating_value:.1f}/5",
            "badge": badge_for(adjusted_price, rating_value, category),
        }
        deals.append(deal)

    deals.sort(key=lambda item: score_deal(item["title"], int(item["price"].replace("$", "").replace(",", "")), float(item["rating"].split("/")[0]), item["seller"], query), reverse=True)
    return deals[:3]


def call_gemini(payload: Dict[str, str]) -> Dict[str, object]:
    api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
    if not api_key or api_key in {"your_gemini_api_key", "your_google_api_key"}:
        return {}

    try:
        import google.generativeai as genai
    except ImportError:
        return {}

    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-1.5-flash")
    prompt = build_gemini_prompt(
        payload.get("query", ""),
        payload.get("mode", "text"),
        payload.get("category", "electronics"),
    )
    response = model.generate_content(prompt)
    text = getattr(response, "text", "")
    if not text:
        return {}

    try:
        parsed = json.loads(text)
        if isinstance(parsed, dict):
            return parsed
    except json.JSONDecodeError:
        pass

    return {}


def main() -> None:
    payload = json.loads(sys.argv[1]) if len(sys.argv) > 1 else {}
    query = payload.get("query", "")
    mode = payload.get("mode", "text")
    category = infer_category(query, payload.get("category", "electronics"))

    gemini_result = call_gemini(payload)
    if gemini_result:
        gemini_result.setdefault("query", query)
        gemini_result.setdefault("mode", mode)
        gemini_result.setdefault("category", category)
        print(json.dumps(gemini_result))
        return

    result = {
        "query": query,
        "mode": mode,
        "category": category,
        "deals": generate_deals(payload),
    }

    print(json.dumps(result))


if __name__ == "__main__":
    main()
