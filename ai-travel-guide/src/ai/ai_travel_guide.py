import pandas as pd
import requests
import re
import random
from typing import Dict, List, Any
from datetime import datetime, timedelta

class AITravelGuide:
    EXPECTED_COLUMNS = {
        "hotels": ["name", "destination", "price_per_night", "rating", "location"],
        "activities": ["name", "destination", "description", "duration_minutes", "tags", "rating"],
    }

    def __init__(self, datasource: str = "api", url: str = None):
        self.datatype = datasource.lower()
        self.url = f"{url}/api" if url else None

        # Load datasets
        self.hotels_df = self.load_data("hotels")
        self.attractions_df = self.load_data("activities")

        print(f"✅ Hotels loaded: {len(self.hotels_df)} rows")
        print(f"✅ Attractions loaded: {len(self.attractions_df)} rows")

    def load_data(self, name: str) -> pd.DataFrame:
        """
        Load data from API (preferred) or CSV fallback.
        Always returns a DataFrame with expected columns.
        """
        expected_cols = self.EXPECTED_COLUMNS.get(name, [])

        # --- Try API ---
        if self.datatype == "api" and self.url:
            try:
                url = f"{self.url}/{name}"
                print(f"🌍 Fetching {name} from API: {url}")
                response = requests.get(url, timeout=10)
                response.raise_for_status()

                data = response.json().get('data', [])
                df = pd.DataFrame(data)
                print(f"Raw {name} data from API: {df.shape[0]} rows, columns={df.columns.tolist()}")
                # Ensure expected columns exist
                for col in expected_cols:
                    if col not in df.columns:
                        df[col] = None  # fill missing with null

                print(f"✅ {name.capitalize()} from API: {df.shape[0]} rows, columns={df.columns.tolist()}")
                return df[expected_cols] if expected_cols else df

            except Exception as e:
                print(f"⚠️ API fetch failed for {name}: {e}")

        # --- Try CSV Fallback ---
        filename = f"data/{name}.csv"
        try:
            print(f"📂 Loading {name} from CSV: {filename}")
            df = pd.read_csv(filename)

            # Ensure expected columns
            for col in expected_cols:
                if col not in df.columns:
                    df[col] = None

            print(f"✅ {name.capitalize()} from CSV: {df.shape[0]} rows, columns={df.columns.tolist()}")
            return df[expected_cols] if expected_cols else df

        except Exception as e:
            print(f"⚠️ Could not load CSV for {name}: {e}")

        # --- Final fallback: empty DataFrame with expected columns ---
        print(f"⚠️ Returning empty DataFrame for {name}")
        return pd.DataFrame(columns=expected_cols)


    def analyze_user_input(self, user_message: str) -> Dict[str, Any]:
        """Analyze user message to extract travel preferences"""
        analysis = {
            'destination': 'Ao Nang',  # Default destination
            'duration_days': 3,
            'budget_level': 'medium',
            'travel_type': ['beach'],  # Default to beach
            'interests': [],
            'group_size': 2,
            'season': self.get_current_season()
        }
        
        user_lower = user_message.lower()
        
        # Extract destination
        destinations = ['ao nang', 'krabi', 'phuket', 'bangkok', 'chiang mai']
        for dest in destinations:
            if dest in user_lower:
                analysis['destination'] = dest.title()
                break
        
        # Extract duration
        duration_match = re.search(r'(\d+)\s*(days?|nights?)', user_lower)
        if duration_match:
            analysis['duration_days'] = int(duration_match.group(1))
        
        # Extract budget level
        if any(word in user_lower for word in ['cheap', 'budget', 'economical', 'low cost']):
            analysis['budget_level'] = 'low'
        elif any(word in user_lower for word in ['luxury', 'premium', 'expensive', 'deluxe']):
            analysis['budget_level'] = 'high'
        
        # Extract travel type
        analysis['travel_type'] = []
        if any(word in user_lower for word in ['beach', 'sea', 'ocean', 'island']):
            analysis['travel_type'].append('beach')
        if any(word in user_lower for word in ['adventure', 'hiking', 'trekking']):
            analysis['travel_type'].append('adventure')
        if any(word in user_lower for word in ['cultural', 'temple', 'history']):
            analysis['travel_type'].append('cultural')
        if any(word in user_lower for word in ['family', 'kids', 'children']):
            analysis['travel_type'].append('family')
        if any(word in user_lower for word in ['romantic', 'couple', 'honeymoon']):
            analysis['travel_type'].append('romantic')
        
        # Default if no type specified
        if not analysis['travel_type']:
            analysis['travel_type'] = ['beach', 'cultural']
        
        return analysis
    
    def get_current_season(self) -> str:
        """Get current season for recommendations"""
        month = datetime.now().month
        if month in [11, 12, 1, 2]:
            return 'high'
        elif month in [3, 4, 5]:
            return 'hot'
        else:
            return 'rainy'
    
    def recommend_hotels(self, analysis: Dict) -> List[Dict]:
        """Recommend hotels based on analysis"""
        if self.hotels_df.empty:
            # Return sample hotels if no data
            return [
                {
                    'name': 'Sea View Resort',
                    'price_per_night': 1500,
                    'rating': 4.5,
                    'type': 'Resort',
                    'features': ['Beachfront', 'Pool', 'Spa'],
                    'total_cost': 1500 * analysis['duration_days']
                },
                {
                    'name': 'Ao Nang Villa',
                    'price_per_night': 800,
                    'rating': 4.0,
                    'type': 'Hotel',
                    'features': ['Budget', 'Central'],
                    'total_cost': 800 * analysis['duration_days']
                }
            ]
        
        df = self.hotels_df.copy()
        
        # Filter by destination
        if analysis['destination'] and 'destination' in df.columns:
            df = df[df['destination'].str.contains(analysis['destination'], case=False, na=False)]
        
        # Filter by budget
        budget_ranges = {
            'low': (0, 1000),
            'medium': (1000, 2500),
            'high': (2500, 10000)
        }
        
        if analysis['budget_level'] in budget_ranges:
            min_price, max_price = budget_ranges[analysis['budget_level']]
            if 'price' in df.columns:
                df = df[(df['price'] >= min_price) & (df['price'] <= max_price)]
        
        # Sort by rating
        if 'rating' in df.columns:
            df = df.sort_values('rating', ascending=False)
        
        recommendations = []
        for _, hotel in df.head(3).iterrows():
            price = hotel.get('price', 1000)
            recommendations.append({
                'name': hotel.get('name', 'Unknown Hotel'),
                'price_per_night': price,
                'rating': hotel.get('rating', 4.0),
                'type': hotel.get('type', 'Hotel'),
                'features': hotel.get('features', '').split(','),
                'total_cost': price * analysis['duration_days']
            })
        
        return recommendations
    
    def recommend_attractions(self, analysis: Dict) -> List[Dict]:
        """Recommend attractions based on analysis"""
        if self.attractions_df.empty:
            # Sample attractions
            return [
                {
                    "name": "Railay Beach",
                    "type": "Beach",
                    "category": "nature,beach",
                    "duration_hours": 4,
                    "best_time": "Morning",
                    "description": "Beautiful beach accessible by boat"
                },
                {
                    "name": "Phi Phi Islands",
                    "type": "Island",
                    "category": "nature,island",
                    "duration_hours": 8,
                    "best_time": "Full Day",
                    "description": "Famous island tour with snorkeling"
                }
            ]
        
        df = self.attractions_df.copy()
        
        # Filter by destination
        if analysis['destination'] and 'destination' in df.columns:
            df = df[df['destination'].str.contains(analysis['destination'], case=False, na=False)]
        
        # Calculate scores for each attraction
        scores = []
        for _, attr in df.iterrows():
            score = 0
            category = str(attr.get('category', '')).lower()
            
            # Match with travel preferences
            for travel_type in analysis['travel_type']:
                if travel_type in category:
                    score += 2
            
            # Season adjustment
            if analysis['season'] == 'rainy' and 'indoor' not in category:
                score -= 1
            
            scores.append(score)
        
        # Add scores to DataFrame safely
        df = df.copy()
        df.loc[:, 'score'] = scores
        df = df.sort_values('score', ascending=False)
        
        return df.head(5).to_dict('records')
    
    def create_daily_itinerary(self, attractions: List[Dict], duration_days: int) -> List[Dict]:
        """Create daily itinerary plan"""
        daily_plans = []
        
        themes = ['Beach Day', 'Island Adventure', 'Cultural Exploration', 'Nature & Relaxation']
        
        for day in range(1, duration_days + 1):
            theme = themes[(day - 1) % len(themes)]
            
            # Select attractions for this day (2-3 attractions per day)
            day_attractions = attractions[(day-1)*2:day*2 + 1] if attractions else []
            
            daily_plan = {
                'day': day,
                'theme': theme,
                'activities': []
            }
            
            time_slots = ['Morning', 'Afternoon', 'Evening']
            for i, time_slot in enumerate(time_slots):
                if i < len(day_attractions):
                    activity = day_attractions[i]
                    daily_plan['activities'].append({
                        'time': time_slot,
                        'name': activity.get('name', 'Activity'),
                        'type': activity.get('type', 'Attraction'),
                        'duration': f"{activity.get('duration_hours', 2)} hours"
                    })
            
            daily_plans.append(daily_plan)
        
        return daily_plans
    
    def calculate_budget(self, hotels: List[Dict], duration_days: int, budget_level: str) -> Dict:
        """Calculate total budget breakdown"""
        if hotels:
            total_hotel_cost = sum(hotel['total_cost'] for hotel in hotels)
        else:
            # Estimate based on budget level
            base_costs = {'low': 800, 'medium': 1500, 'high': 3000}
            total_hotel_cost = base_costs.get(budget_level, 1500) * duration_days
        
        # Other costs estimates
        food_budget = duration_days * (500 if budget_level == 'low' else 1000 if budget_level == 'medium' else 2000)
        activities_budget = duration_days * (300 if budget_level == 'low' else 600 if budget_level == 'medium' else 1200)
        transportation = duration_days * 200
        
        total_budget = total_hotel_cost + food_budget + activities_budget + transportation
        
        return {
            'total_budget': total_budget,
            'hotel_cost': total_hotel_cost,
            'food_budget': food_budget,
            'activities_budget': activities_budget,
            'transportation': transportation,
            'daily_average': total_budget / duration_days
        }
    
    def generate_travel_plan(self, user_message: str) -> Dict[str, Any]:
        """Generate complete travel plan"""
        try:
            print(f"Analyzing user request: {user_message}")
            
            # Analyze user input
            analysis = self.analyze_user_input(user_message)
            print(f"Analysis result: {analysis}")
            
            # Get recommendations
            hotels = self.recommend_hotels(analysis)
            attractions = self.recommend_attractions(analysis)
            daily_itinerary = self.create_daily_itinerary(attractions, analysis['duration_days'])
            
            # Calculate budget
            budget = self.calculate_budget(hotels, analysis['duration_days'], analysis['budget_level'])
            
            # Generate response
            response_message = self.generate_response_message(analysis, hotels, daily_itinerary, budget)
            
            return {
                'success': True,
                'analysis': analysis,
                'recommendations': {
                    'hotels': hotels,
                    'attractions': attractions,
                    'daily_itinerary': daily_itinerary
                },
                'budget': budget,
                'response_message': response_message,
                'travel_tips': self.generate_travel_tips(analysis)
            }
            
        except Exception as e:
            print(f"Error generating travel plan: {e}")
            return {
                'success': False,
                'error': str(e),
                'fallback_plan': self.generate_fallback_plan()
            }
    
    def generate_fallback_plan(self) -> Dict:
        """Generate fallback plan when error occurs"""
        return {
            'response_message': """ **Ao Nang Travel Plan** 

I recommend a 3-day beach vacation in beautiful Ao Nang!

** Suggested Hotels:**
- Sea View Resort (1500฿/night) 4.5
- Ao Nang Villa (800฿/night) 4.0

** Top Activities:**
- Railay Beach & Phra Nang Cave
- Phi Phi Islands day trip
- Emerald Pool & Hot Springs

** Estimated Budget: 12,000-15,000฿ for 3 days**

Enjoy your trip! """,
            'budget': {'total_budget': 15000, 'daily_average': 5000}
        }
    
    def generate_response_message(self, analysis: Dict, hotels: List, itinerary: List, budget: Dict) -> str:
        """Generate natural language response"""
        dest = analysis['destination']
        days = analysis['duration_days']
        
        message = f""" **Perfect {dest} Travel Plan for {days} Days** 

**Destination:** {dest}
** Duration:** {days} days
** Budget Level:** {analysis['budget_level'].title()}
** Travel Style:** {', '.join(analysis['travel_type']).title()}

**Recommended Hotels:**
"""
        
        for i, hotel in enumerate(hotels[:3], 1):
            message += f"{i}. **{hotel['name']}** - {hotel['price_per_night']}฿/night {hotel['rating']}\n"
        
        message += f"""
**Daily Itinerary:**
"""
        
        for day_plan in itinerary:
            message += f"\n**Day {day_plan['day']}: {day_plan['theme']}**\n"
            for activity in day_plan['activities']:
                message += f"  • {activity['time']}: {activity['name']} ({activity['duration']})\n"
        
        message += f"""
** Budget Estimate:**
• Total: {budget['total_budget']:,.0f}฿
• Hotels: {budget['hotel_cost']:,.0f}฿
• Food: {budget['food_budget']:,.0f}฿
• Activities: {budget['activities_budget']:,.0f}฿
• Daily Average: {budget['daily_average']:,.0f}฿

** Travel Tips:**
{self.generate_travel_tips(analysis)}

Have an amazing trip! """
        
        return message
    
    def generate_travel_tips(self, analysis: Dict) -> str:
        """Generate personalized travel tips"""
        tips = []
        
        if 'beach' in analysis['travel_type']:
            tips.append("• Visit beaches early morning to avoid crowds")
        
        if analysis['season'] == 'rainy':
            tips.append("• Bring umbrella and plan indoor activities for afternoon")
        
        if analysis['budget_level'] == 'low':
            tips.append("• Try local food markets for affordable meals")
        
        tips.append("• Book activities in advance during high season")
        tips.append("• Use sunscreen and stay hydrated")
        
        return '\n'.join(tips)

# Test function
def test_system():
    """Test the travel guide system"""
    guide = AITravelGuide()
    
    test_queries = [
        "I want beach vacation in Ao Nang for 3 days",
        "Romantic trip to Krabi for 5 days with medium budget",
        "Family vacation for 4 days"
    ]
    
    for query in test_queries:
        print(f"\n{'='*60}")
        print(f"Testing: {query}")
        print(f"{'='*60}")
        
        result = guide.generate_travel_plan(query)
        if result['success']:
            print(result['response_message'])
        else:
            print("Error:", result['error'])
            print("Fallback plan:")
            print(result['fallback_plan']['response_message'])

if __name__ == "__main__":
    test_system()