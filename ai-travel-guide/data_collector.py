# data_collector.py
import requests
import pandas as pd
import json
from typing import Dict, List

class TravelDataCollector:
    def __init__(self):
        self.api_key = "5ae2e3f221c38a28845f05b6facc9b7fd2ffb55482aadce0b83a40ff"
    
    def get_city_attractions(self, city: str, limit: int = 50) -> pd.DataFrame:
        """Get tourist attractions for a city"""
        try:
            # Get city coordinates
            city_url = f"http://api.opentripmap.com/0.1/en/places/geoname?name={city}&apikey={self.api_key}"
            city_data = requests.get(city_url).json()
            
            lat, lon = city_data['lat'], city_data['lon']
            
            # Get popular places
            places_url = f"http://api.opentripmap.com/0.1/en/places/radius?radius=10000&lat={lat}&lon={lon}&apikey={self.api_key}&limit={limit}&rate=3"
            response = requests.get(places_url).json()
            
            attractions = []
            for feature in response.get('features', []):
                props = feature['properties']
                attractions.append({
                    'name': props.get('name', 'Unknown'),
                    'type': props.get('kinds', 'Unknown').split(',')[0],
                    'category': props.get('kinds', 'Unknown'),
                    'rating': props.get('rate', 3),
                    'description': f"{props.get('name')} in {city}",
                    'city': city,
                    'lat': feature['geometry']['coordinates'][1],
                    'lon': feature['geometry']['coordinates'][0]
                })
            
            return pd.DataFrame(attractions)
            
        except Exception as e:
            print(f"Error fetching data for {city}: {e}")
            return pd.DataFrame()
    
    def create_sample_data(self):
        """Create sample travel data for testing"""
        # Sample hotels data
        hotels_data = {
            'name': [
                'Sea View Resort Ao Nang', 'Aonang Princeville Resort', 'Krabi Resort', 
                'The Nine Thipthara Krabi', 'Ao Nang Villa Resort', 'Centara Ao Nang',
                'Holiday Inn Krabi', 'Dusit Thani Krabi', 'Rayavadee Resort', 'Anyavee Ao Nang'
            ],
            'city': ['Ao Nang'] * 10,
            'price': [2500, 1800, 1200, 3000, 900, 2200, 2800, 3500, 5000, 800],
            'rating': [4.5, 4.2, 4.0, 4.7, 3.8, 4.3, 4.4, 4.8, 4.9, 3.5],
            'type': ['Resort', 'Resort', 'Hotel', 'Luxury', 'Villa', 'Resort', 'Hotel', 'Luxury', 'Resort', 'Budget'],
            'features': ['Beachfront,Pool,Spa', 'Pool,Restaurant', 'Pool,Garden', 'Luxury,Spa,Pool', 
                        'Budget,Basic', 'Family,Pool', 'Business,Pool', 'Luxury,Spa', 'Private,Beach', 'Budget']
        }
        
        # Sample attractions data
        attractions_data = {
            'name': [
                'Railay Beach', 'Phi Phi Islands', 'Emerald Pool', 'Tiger Cave Temple',
                'Ao Nang Beach', 'Hong Islands', 'Than Bok Khorani National Park',
                'Krabi Town Night Market', 'Wat Kaew Korawaram', 'Shell Cemetery'
            ],
            'city': ['Ao Nang'] * 10,
            'type': ['Beach', 'Island', 'Nature', 'Temple', 'Beach', 'Island', 'National Park', 
                    'Market', 'Temple', 'Natural Wonder'],
            'category': ['nature,beach,swimming', 'nature,island,boat', 'nature,pool,forest',
                        'cultural,temple,view', 'nature,beach,relax', 'nature,island,snorkeling',
                        'nature,park,walking', 'shopping,food,cultural', 'cultural,temple,historical',
                        'nature,unique,geological'],
            'price_range': ['Free', 'Paid', 'Paid', 'Free', 'Free', 'Paid', 'Paid', 'Free', 'Free', 'Paid'],
            'duration_hours': [4, 8, 3, 2, 2, 6, 4, 3, 1, 2],
            'best_time': ['Morning', 'Full Day', 'Afternoon', 'Morning', 'Evening', 'Full Day', 'Morning', 'Evening', 'Morning', 'Afternoon']
        }
        
        hotels_df = pd.DataFrame(hotels_data)
        attractions_df = pd.DataFrame(attractions_data)
        
        hotels_df.to_csv('hotels_database.csv', index=False)
        attractions_df.to_csv('attractions_database.csv', index=False)
        
        print("Sample data created successfully!")
        return hotels_df, attractions_df

# Run data collection
if __name__ == "__main__":
    collector = TravelDataCollector()
    collector.create_sample_data()