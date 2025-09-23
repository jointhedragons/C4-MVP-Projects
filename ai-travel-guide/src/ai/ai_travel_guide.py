import pandas as pd
import requests
import re
import random
import math
from typing import Dict, List, Any, Optional
from datetime import datetime

class AITravelGuide:
    """
    AITravelGuide - data-source-agnostic travel planner helper.
    Supports datasource: 'manual' (pass lists as args), 'api' (fetch from <url>/api/<name>), or 'csv' (data/<name>.csv).
    """

    EXPECTED_COLUMNS = {
        "hotels": ["_id", "name", "destination", "price_per_night", "rating", "location"],
        "activities": ["_id", "name", "destination", "description", "duration_minutes", "tags", "rating"],
    }

    DEFAULT_BUDGET_RANGES = {
        'low': (0, 70),
        'medium': (70, 150),
        'high': (150, 10000)
    }

    def __init__(
        self,
        datasource: str = "manual",
        url: Optional[str] = None,
        hotels: Optional[List[Dict]] = None,
        activities: Optional[List[Dict]] = None,
        budget_ranges: Optional[Dict[str, tuple]] = None
    ):
        self.datasource = datasource.lower()
        self.url = f"{url}/api" if url else None
        self.manual_hotels = hotels or []
        self.manual_activities = activities or []
        self.budget_ranges = budget_ranges or self.DEFAULT_BUDGET_RANGES

        # Load dataframes
        self.hotels_df = self.load_data("hotels")
        self.attractions_df = self.load_data("activities")

        # Build dynamic destination list from data (case preserved)
        hotels_dest = [d for d in pd.unique(self.hotels_df["destination"].dropna())] if "destination" in self.hotels_df.columns else []
        acts_dest = [d for d in pd.unique(self.attractions_df["destination"].dropna())] if "destination" in self.attractions_df.columns else []
        self.KNOWN_DESTINATIONS = list(dict.fromkeys([str(x) for x in (hotels_dest + acts_dest) if x and str(x).strip()]))  # preserve order

        print(f"✅ Hotels loaded: {len(self.hotels_df)} rows")
        print(f"✅ Attractions loaded: {len(self.attractions_df)} rows")
        print(f"ℹ️ Known destinations: {self.KNOWN_DESTINATIONS}")

    # -----------------------
    # Data normalization helpers
    # -----------------------
    def _parse_tags(self, val: Any) -> List[str]:
        if val is None or (isinstance(val, float) and pd.isna(val)):
            return []
        if isinstance(val, list):
            return [str(x).strip().lower() for x in val if str(x).strip()]
        s = str(val).strip()
        if s.startswith('[') and s.endswith(']'):
            s = s[1:-1]
        # split by common separators
        parts = re.split(r'[;,]\s*|\s*\|\s*|\s*,\s*', s)
        return [p.strip().lower() for p in parts if p.strip()]

    def _normalize_columns_and_types(self, name: str, df: pd.DataFrame) -> pd.DataFrame:
        """
        - normalize column names to lower_snake
        - map common alternates (price -> price_per_night, duration -> duration_minutes)
        - ensure expected columns exist
        - normalize types (price numeric, duration int, rating numeric, tags -> list[str])
        """
        expected = self.EXPECTED_COLUMNS.get(name, [])
        if df is None:
            df = pd.DataFrame(columns=expected)
            return df

        df = df.copy()

        # normalize column names
        col_map_lower = {col: col.strip() for col in df.columns}
        # build lowercase mapping to original names
        lower_to_orig = {str(c).strip().lower(): c for c in df.columns}
        # rename to lower_snake to ease mapping
        df.columns = [str(c).strip() for c in df.columns]
        # map common alt names to expected
        rename_map = {}
        if 'price_per_night' not in [c.lower() for c in df.columns]:
            if 'price' in lower_to_orig:
                rename_map[lower_to_orig['price']] = 'price_per_night'
        if 'duration_minutes' not in [c.lower() for c in df.columns]:
            if 'duration' in lower_to_orig:
                rename_map[lower_to_orig['duration']] = 'duration_minutes'
        # apply rename
        if rename_map:
            df = df.rename(columns=rename_map)

        # ensure expected exist
        for col in expected:
            if col not in df.columns:
                df[col] = None

        # types
        if 'price_per_night' in df.columns:
            df['price_per_night'] = pd.to_numeric(df['price_per_night'], errors='coerce')

        if 'duration_minutes' in df.columns:
            df['duration_minutes'] = pd.to_numeric(df['duration_minutes'], errors='coerce').fillna(120).astype(int)

        if 'rating' in df.columns:
            df['rating'] = pd.to_numeric(df['rating'], errors='coerce')

        if 'tags' in df.columns:
            df['tags'] = df['tags'].apply(self._parse_tags)
        else:
            df['tags'] = [[] for _ in range(len(df))]

        # make sure columns are in expected order (keep _id if available)
        for col in expected:
            if col not in df.columns:
                df[col] = None

        return df[expected]

    # -----------------------
    # Loading data (manual / api / csv)
    # -----------------------
    def load_data(self, name: str) -> pd.DataFrame:
        expected_cols = self.EXPECTED_COLUMNS.get(name, [])

        # manual mode (passed lists)
        if self.datasource == "manual":
            raw = self.manual_hotels if name == "hotels" else self.manual_activities if name == "activities" else []
            try:
                df = pd.DataFrame(raw)
            except Exception:
                df = pd.DataFrame(columns=expected_cols)
            return self._normalize_columns_and_types(name, df)

        # api mode
        if self.datasource == "api" and self.url:
            try:
                url = f"{self.url}/{name}"
                print(f"🌍 Fetching {name} from API: {url}")
                resp = requests.get(url, timeout=10)
                resp.raise_for_status()
                payload = resp.json()
                # handle different shapes
                if isinstance(payload, dict) and "data" in payload:
                    data_list = payload["data"]
                elif isinstance(payload, list):
                    data_list = payload
                elif isinstance(payload, dict):
                    # pick first list value if present, otherwise try values-to-list
                    lists = [v for v in payload.values() if isinstance(v, list)]
                    data_list = lists[0] if lists else []
                else:
                    data_list = []
                df = pd.DataFrame(data_list)
                return self._normalize_columns_and_types(name, df)
            except Exception as e:
                print(f"⚠️ API fetch failed for {name}: {e}")

        # csv mode
        if self.datasource == "csv":
            filename = f"data/{name}.csv"
            try:
                print(f"📂 Loading {name} from CSV: {filename}")
                df = pd.read_csv(filename)
                return self._normalize_columns_and_types(name, df)
            except Exception as e:
                print(f"⚠️ CSV load failed for {name}: {e}")

        # fallback empty DataFrame with expected columns
        print(f"⚠️ Returning empty DataFrame for {name}")
        return pd.DataFrame(columns=expected_cols)

    # -----------------------
    # Utilities
    # -----------------------
    def get_current_season(self) -> str:
        month = datetime.now().month
        if month in [11, 12, 1, 2]:
            return "high"
        elif month in [3, 4, 5]:
            return "hot"
        else:
            return "rainy"

    def detect_season_from_text(self, text: str) -> Optional[str]:
        months_map = {
            'december': 'high', 'january': 'high', 'february': 'high', 'november': 'high',
            'march': 'hot', 'april': 'hot', 'may': 'hot',
            'june': 'rainy', 'july': 'rainy', 'august': 'rainy', 'september': 'rainy', 'october': 'rainy'
        }
        for mon, season in months_map.items():
            if mon[:3] in text:
                return season
        return None

    # -----------------------
    # Input analysis (single clean method)
    # -----------------------
    def analyze_user_input(self, user_message: str) -> Dict[str, Any]:
        """
        Extract destination, duration, budget, travel types, group size, season from text.
        Destination detection is dynamic using KNOWN_DESTINATIONS built from the loaded data.
        """
        analysis = {
            "destination": None,
            "duration_days": 3,
            "budget_level": "medium",
            "travel_type": [],
            "interests": [],
            "group_size": 2,
            "season": self.get_current_season(),
        }
        if not user_message:
            return analysis

        text = user_message.lower()

        # Destination detection from known destinations (match substring)
        for dest in self.KNOWN_DESTINATIONS:
            try:
                if dest and dest.lower() in text:
                    analysis["destination"] = dest
                    break
            except Exception:
                continue

        # If still none, try detect a word that looks like a destination (fallback: leave None)
        if not analysis["destination"] and self.KNOWN_DESTINATIONS:
            analysis["destination"] = self.KNOWN_DESTINATIONS[0]

        # Duration: "3 days", "2 nights"
        m = re.search(r'(\d+)\s*(days?|nights?)', text)
        if m:
            analysis["duration_days"] = max(1, int(m.group(1)))

        # Group size: "for 4 people", "we are 5"
        g = re.search(r'\b(\d+)\s*(people|persons|adults|kids|children|guests|pax)\b', text)
        if g:
            analysis["group_size"] = max(1, int(g.group(1)))

        # Budget
        if any(k in text for k in ["cheap", "budget", "low cost", "backpacker"]):
            analysis["budget_level"] = "low"
        elif any(k in text for k in ["luxury", "expensive", "premium", "deluxe", "5-star"]):
            analysis["budget_level"] = "high"
        elif any(k in text for k in ["mid", "medium", "mid-range"]):
            analysis["budget_level"] = "medium"

        # Travel type detection
        types_map = {
            "beach": ["beach", "sea", "island"],
            "adventure": ["adventure", "hiking", "trek", "safari"],
            "cultural": ["culture", "temple", "history", "museum"],
            "family": ["family", "kids", "children"],
            "romantic": ["romantic", "honeymoon", "couple"],
        }
        for t, kw in types_map.items():
            if any(k in text for k in kw):
                analysis["travel_type"].append(t)

        if not analysis["travel_type"]:
            analysis["travel_type"] = ["cultural"]

        # Season from text override (e.g., "in July")
        season_from_text = self.detect_season_from_text(text)
        if season_from_text:
            analysis["season"] = season_from_text

        return analysis

    # -----------------------
    # Recommendation logic
    # -----------------------
    def recommend_hotels(self, analysis: Dict) -> List[Dict]:
        if self.hotels_df.empty:
            # fallback samples
            rooms = math.ceil(max(1, analysis.get('group_size', 1)) / 2)
            days = analysis.get('duration_days', 1)
            return [
                {'id': None, 'name': 'Sea View Resort', 'price_per_night': 1500.0, 'rating': 4.5, 'location': 'Beachfront', 'total_cost': 1500.0 * rooms * days},
                {'id': None, 'name': 'Ao Nang Villa', 'price_per_night': 800.0, 'rating': 4.0, 'location': 'Central', 'total_cost': 800.0 * rooms * days},
            ]

        df = self.hotels_df.copy()

        # Filter by destination if provided
        dest = analysis.get('destination')
        if dest and 'destination' in df.columns:
            df = df[df['destination'].str.contains(str(dest), case=False, na=False)]

        # Apply budget filter if available
        budget_level = analysis.get('budget_level', 'medium')
        if budget_level in self.budget_ranges and 'price_per_night' in df.columns:
            min_p, max_p = self.budget_ranges[budget_level]
            df = df[(df['price_per_night'].fillna(0) >= min_p) & (df['price_per_night'].fillna(1e9) <= max_p)]

        # Relax if too few results
        if df.shape[0] < 3 and 'price_per_night' in self.hotels_df.columns:
            df = self.hotels_df.copy()
            if dest and 'destination' in df.columns:
                df = df[df['destination'].str.contains(str(dest), case=False, na=False)]
            if df.shape[0] < 3:
                df = self.hotels_df.copy()

        # Sort: rating desc, price asc
        if 'rating' in df.columns and 'price_per_night' in df.columns:
            df = df.sort_values(['rating', 'price_per_night'], ascending=[False, True])
        elif 'rating' in df.columns:
            df = df.sort_values('rating', ascending=False)

        rooms = math.ceil(max(1, analysis.get('group_size', 1)) / 2)
        days = analysis.get('duration_days', 1)

        recs = []
        for _, row in df.head(5).iterrows():
            price = float(row.get('price_per_night') or 0)
            total_cost = price * rooms * days
            recs.append({
                'id': str(row['_id']) if row.get('_id') is not None else None,
                'name': row.get('name') or 'Unknown Hotel',
                'price_per_night': price,
                'rating': float(row.get('rating') or 0),
                'location': row.get('location') or '',
                'total_cost': total_cost
            })
            if len(recs) >= 3:
                break

        if not recs:
            recs = [{'id': None, 'name': 'Fallback Hotel', 'price_per_night': 100.0, 'rating': 4.0, 'location': 'Unknown', 'total_cost': 100.0 * rooms * days}]
        return recs

    def recommend_attractions(self, analysis: Dict) -> List[Dict]:
        if self.attractions_df.empty:
            return [
                {'id': None, 'name': 'Railay Beach', 'description': 'Beautiful beach', 'tags': ['beach', 'nature'], 'duration_hours': 4, 'rating': 4.6, 'destination': analysis.get('destination')},
                {'id': None, 'name': 'Phi Phi Islands', 'description': 'Island trip', 'tags': ['island'], 'duration_hours': 8, 'rating': 4.7, 'destination': analysis.get('destination')},
            ]

        df = self.attractions_df.copy()
        dest = analysis.get('destination')
        if dest and 'destination' in df.columns:
            df = df[df['destination'].str.contains(str(dest), case=False, na=False)]

        scores = []
        for _, row in df.iterrows():
            score = 0.0
            tags = row.get('tags') or []
            desc = str(row.get('description', '')).lower()

            for t in analysis.get('travel_type', []):
                if t in tags or t in desc:
                    score += 2.0

            rating = row.get('rating')
            if pd.notna(rating):
                try:
                    score += float(rating) * 0.5
                except Exception:
                    pass

            if analysis.get('season') == 'rainy' and 'indoor' not in (tags or []):
                score -= 0.5

            score += random.random() * 0.1
            scores.append(score)

        if not scores:
            return []

        df = df.copy()
        df.loc[:, 'score'] = scores
        df = df.sort_values('score', ascending=False)

        results = []
        for _, row in df.head(8).iterrows():
            duration_minutes = int(row.get('duration_minutes') or 120)
            duration_hours = max(1, duration_minutes // 60)
            results.append({
                'id': str(row['_id']) if row.get('_id') is not None else None,
                'name': row.get('name') or 'Attraction',
                'description': row.get('description') or '',
                'tags': row.get('tags') or [],
                'duration_hours': duration_hours,
                'rating': float(row.get('rating') or 0),
                'destination': row.get('destination') or ''
            })
        return results

    # -----------------------
    # Itinerary + Budget
    # -----------------------
    def create_daily_itinerary(self, attractions: List[Dict], duration_days: int) -> List[Dict]:
        if not attractions:
            return [{'day': d, 'theme': 'Relax & Explore', 'activities': [{'time': 'Flexible', 'name': 'Explore local area', 'duration': 'Varies', 'description': ''}]} for d in range(1, duration_days + 1)]

        slots_per_day = 3
        total_slots = duration_days * slots_per_day
        pool = attractions.copy()
        while len(pool) < total_slots:
            pool.extend(attractions)
            random.shuffle(pool)

        idx = 0
        themes = ['Beach Day', 'Island Adventure', 'Cultural Exploration', 'Nature & Relaxation', 'City Sights']
        daily = []
        for day in range(1, duration_days + 1):
            theme = themes[(day - 1) % len(themes)]
            activities = []
            for time_slot in ['Morning', 'Afternoon', 'Evening']:
                if idx >= len(pool):
                    break
                a = pool[idx]
                activities.append({
                    'time': time_slot,
                    'id': a.get('id'),
                    'name': a.get('name'),
                    'duration': f"{a.get('duration_hours', 2)} hours",
                    'description': a.get('description', ''),
                    'rating': a.get('rating', 0)
                })
                idx += 1
            daily.append({'day': day, 'theme': theme, 'activities': activities})
        return daily

    def calculate_budget(self, hotels: List[Dict], duration_days: int, budget_level: str, group_size: int) -> Dict:
        rooms = math.ceil(max(1, group_size) / 2)
        # hotels list might contain total_cost already
        total_hotel_cost = 0
        if hotels:
            for h in hotels:
                if 'total_cost' in h and h['total_cost']:
                    total_hotel_cost += h['total_cost']
                else:
                    price = h.get('price_per_night') or 0
                    total_hotel_cost += price * rooms * duration_days
        else:
            base_room_price = 75 if budget_level == 'medium' else 40 if budget_level == 'low' else 200
            total_hotel_cost = base_room_price * rooms * duration_days

        per_person_food = 300 if budget_level == 'low' else 600 if budget_level == 'medium' else 1200
        per_person_activity = 200 if budget_level == 'low' else 400 if budget_level == 'medium' else 900

        food_budget = duration_days * per_person_food * group_size
        activities_budget = duration_days * per_person_activity * group_size

        transport_per_day_group = 200
        transportation = duration_days * transport_per_day_group * max(1, math.ceil(group_size / 4))

        total_budget = total_hotel_cost + food_budget + activities_budget + transportation
        return {
            'total_budget': int(total_budget),
            'hotel_cost': int(total_hotel_cost),
            'food_budget': int(food_budget),
            'activities_budget': int(activities_budget),
            'transportation': int(transportation),
            'daily_average': int(total_budget / max(1, duration_days))
        }

    # -----------------------
    # Output & orchestration
    # -----------------------
    def generate_travel_tips(self, analysis: Dict) -> str:
        tips = []
        if 'beach' in analysis.get('travel_type', []):
            tips.append("Visit beaches early morning to avoid crowds.")
        if analysis.get('season') == 'rainy':
            tips.append("Bring an umbrella and plan some indoor activities.")
        if analysis.get('budget_level') == 'low':
            tips.append("Try local food markets for affordable meals.")
        tips.append("Book activities in advance during high season.")
        tips.append("Use sunscreen and stay hydrated.")
        return "\n".join(tips)

    def generate_response_message(self, analysis: Dict, hotels: List[Dict], itinerary: List[Dict], budget: Dict) -> str:
        dest = analysis.get('destination') or 'Destination'
        days = analysis.get('duration_days', 1)
        lines = []
        lines.append(f"# 🌍 Travel Plan — {dest} ({days} days)\n")
        lines.append(f"**Destination:** {dest}")
        lines.append(f"**Duration:** {days} days")
        lines.append(f"**Budget Level:** {analysis.get('budget_level', 'Medium').title()}")
        lines.append(f"**Travel Style:** {', '.join([t.title() for t in analysis.get('travel_type', [])])}\n")

        lines.append("## 🏨 Recommended Hotels")
        if hotels:
            for i, h in enumerate(hotels[:3], 1):
                lines.append(f"{i}. **{h['name']}** — {h['price_per_night']:,} per night — Rating: {h['rating']} (Total: {int(h['total_cost'])})")
        else:
            lines.append("No hotel recommendations available.")

        lines.append("\n## 🗺️ Daily Itinerary")
        for day in itinerary:
            lines.append(f"### Day {day['day']}: {day['theme']}")
            for act in day['activities']:
                lines.append(f"- **{act['time']}** — {act['name']} ({act['duration']}) — {act.get('description','')}")

        lines.append("\n## 💰 Budget Estimate")
        lines.append(f"- Total: {budget['total_budget']:,}")
        lines.append(f"- Hotels: {budget['hotel_cost']:,}")
        lines.append(f"- Food: {budget['food_budget']:,}")
        lines.append(f"- Activities: {budget['activities_budget']:,}")
        lines.append(f"- Transportation: {budget['transportation']:,}")
        lines.append(f"- Daily Average: {budget['daily_average']:,}\n")

        lines.append("## ✈️ Travel Tips")
        lines.append(self.generate_travel_tips(analysis))
        return "\n".join(lines)

    def generate_fallback_plan(self) -> Dict:
        return {
            'response_message': ("**Ao Nang Travel Plan**\n\n"
                                 "I recommend a 3-day beach vacation in beautiful Ao Nang!\n\n"
                                 "Suggested Hotels:\n- Sea View Resort (1500/night) 4.5\n- Ao Nang Villa (800/night) 4.0\n\n"
                                 "Top Activities:\n- Railay Beach & Phra Nang Cave\n- Phi Phi Islands day trip\n- Emerald Pool & Hot Springs\n\nEstimated Budget: 12,000-15,000"),
            'budget': {'total_budget': 15000, 'daily_average': 5000}
        }

    def generate_travel_plan(self, user_message: str) -> Dict[str, Any]:
        print("🚀 Generating travel plan...")
        try:
            print(f"🔎 Analyzing: {user_message}")
            analysis = self.analyze_user_input(user_message)
            print(f"ℹ️ Analysis: {analysis}")

            hotels = self.recommend_hotels(analysis)
            attractions = self.recommend_attractions(analysis)
            itinerary = self.create_daily_itinerary(attractions, analysis['duration_days'])
            budget = self.calculate_budget(hotels, analysis['duration_days'], analysis['budget_level'], analysis['group_size'])
            response_message = self.generate_response_message(analysis, hotels, itinerary, budget)

            return {
                'success': True,
                'analysis': analysis,
                'recommendations': {
                    'hotels': hotels,
                    'attractions': attractions,
                    'daily_itinerary': itinerary,
                },
                'budget': budget,
                'response_message': response_message,
                'travel_tips': self.generate_travel_tips(analysis)
            }
        except Exception as e:
            print(f"❌ Error generating travel plan: {e}")
            return {'success': False, 'error': str(e), 'fallback_plan': self.generate_fallback_plan()}

# -----------------------
# Quick test harness using user's provided hotel/activity lists (manual mode)
# -----------------------
def test_system():
    sample_hotels = [
      { 'name': 'Central Plaza Hotel', 'destination': 'Cairo', 'price_per_night': 55, 'rating': 4.1, 'location': 'Downtown' },
      { 'name': 'Nile View Inn', 'destination': 'Cairo', 'price_per_night': 85, 'rating': 4.6, 'location': 'Zamalek' },
      { 'name': 'Budget Stay', 'destination': 'Alexandria', 'price_per_night': 30, 'rating': 3.9, 'location': 'Corniche' },
      { 'name': 'Mediterranean Breeze Hotel', 'destination': 'Alexandria', 'price_per_night': 70, 'rating': 4.3, 'location': 'Stanley' },
      { 'name': 'Pyramids Horizon Resort', 'destination': 'Giza', 'price_per_night': 95, 'rating': 4.7, 'location': 'Pyramids Area' },
      { 'name': 'Luxor Palace Hotel', 'destination': 'Luxor', 'price_per_night': 60, 'rating': 4.2, 'location': 'Nile Corniche' },
      { 'name': 'Aswan Riverside Lodge', 'destination': 'Aswan', 'price_per_night': 50, 'rating': 4.0, 'location': 'Nile View' },
      { 'name': 'Desert Star Hotel', 'destination': 'Siwa Oasis', 'price_per_night': 45, 'rating': 4.4, 'location': 'Siwa Town Center' },
      { 'name': 'Red Sea Paradise', 'destination': 'Hurghada', 'price_per_night': 110, 'rating': 4.8, 'location': 'Beachfront' },
      { 'name': 'Sharm El Sheikh Retreat', 'destination': 'Sharm El Sheikh', 'price_per_night': 120, 'rating': 4.9, 'location': 'Naama Bay' },
    ]

    sample_activities = [
      { 'name': 'Museum Visit', 'destination': 'Cairo', 'description': 'Explore historical artifacts', 'duration_minutes': 120, 'tags': ['history', 'museum'], 'rating': 4.5 },
      { 'name': 'Nile Boat Ride', 'destination': 'Cairo', 'description': 'Relaxing boat trip on the Nile', 'duration_minutes': 90, 'tags': ['relax', 'sightseeing'], 'rating': 4.7 },
      { 'name': 'Citadel Tour', 'destination': 'Cairo', 'description': 'Visit the citadel and mosques', 'duration_minutes': 180, 'tags': ['history', 'sightseeing'], 'rating': 4.4 },
      { 'name': 'Library of Alexandria Tour', 'destination': 'Alexandria', 'description': 'Discover the modern Library of Alexandria', 'duration_minutes': 150, 'tags': ['culture', 'library'], 'rating': 4.6 },
      { 'name': 'Stanley Bridge Walk', 'destination': 'Alexandria', 'description': 'Evening walk along the famous bridge and Corniche', 'duration_minutes': 60, 'tags': ['relax', 'sightseeing'], 'rating': 4.3 },
      { 'name': 'Pyramids of Giza Visit', 'destination': 'Giza', 'description': 'See the Great Pyramids and Sphinx', 'duration_minutes': 240, 'tags': ['history', 'landmark'], 'rating': 4.9 },
      { 'name': 'Valley of the Kings Tour', 'destination': 'Luxor', 'description': 'Explore the tombs of the pharaohs', 'duration_minutes': 210, 'tags': ['history', 'archaeology'], 'rating': 4.8 },
      { 'name': 'Felucca Ride', 'destination': 'Aswan', 'description': 'Sail a traditional boat on the Nile at sunset', 'duration_minutes': 75, 'tags': ['relax', 'culture'], 'rating': 4.7 },
      { 'name': 'Siwa Oasis Safari', 'destination': 'Siwa Oasis', 'description': 'Jeep tour across the desert and salt lakes', 'duration_minutes': 300, 'tags': ['adventure', 'nature'], 'rating': 4.6 },
      { 'name': 'Snorkeling in the Red Sea', 'destination': 'Hurghada', 'description': 'Snorkel in crystal-clear waters full of coral reefs', 'duration_minutes': 180, 'tags': ['adventure', 'water'], 'rating': 4.9 },
    ]

    # guide = AITravelGuide(datasource='manual', hotels=sample_hotels, activities=sample_activities)
    guide = AITravelGuide(datasource='api', url='http://localhost:4000')

    test_queries = [
        "I want a beach vacation in Ao Nang for 3 days for 2 people",
        "Romantic trip to Krabi for 5 days with medium budget for 2 people",
        "Family vacation in Cairo for 4 days, 5 people, cheap",
        "I want culture and museums in Alexandria for 2 days"
    ]

    for q in test_queries:
        print("\n" + "="*80)
        print(f"TEST QUERY: {q}")
        print("="*80)
        res = guide.generate_travel_plan(q)
        if res['success']:
            print(res['response_message'])
        else:
            print("Error:", res.get('error'))
            print(res.get('fallback_plan', {}).get('response_message'))

if __name__ == "__main__":
    test_system()
