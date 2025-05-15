from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
import pandas as pd
import os
import json
from .data_processor import RealEstateDataProcessor

# Path to preloaded data file
DEFAULT_DATA_PATH = os.path.join(settings.BASE_DIR, 'data', 'Sample_data.csv')

class QueryAPIView(APIView):
    """API view to handle real estate queries."""
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Initialize with default data if available
        if os.path.exists(DEFAULT_DATA_PATH):
            self.data_processor = RealEstateDataProcessor(file_path=DEFAULT_DATA_PATH)
        else:
            self.data_processor = None
    
    def post(self, request):
        """Process user query and return analysis."""
        query = request.data.get('query', '')
        
        # Handle file upload if provided
        file = request.FILES.get('file')
        if file:
            # Save uploaded file
            file_path = os.path.join(settings.MEDIA_ROOT, 'uploads', file.name)
            os.makedirs(os.path.dirname(file_path), exist_ok=True)
            
            with open(file_path, 'wb') as destination:
                for chunk in file.chunks():
                    destination.write(chunk)
            
            self.data_processor = RealEstateDataProcessor(file_path=file_path)
        
        # Ensure data processor is available
        if not self.data_processor:
            return Response(
                {"error": "No data available. Please upload a file."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Process query
        result = self._process_query(query)
        return Response(result)
    
    def _process_query(self, query):
        """Process the user query and return appropriate data."""
        query = query.lower()
        
        # Case 1: Analysis of specific area
        if "analysis of" in query or "analyze" in query:
            # Extract area name - simple approach
            for area in self.data_processor.get_areas():
                if area.lower() in query:
                    price_trends = self.data_processor.get_price_trends(area)
                    area_data = self.data_processor.filter_by_area(area)
                    summary = self.data_processor.generate_summary(area)
                    
                    return {
                        "type": "area_analysis",
                        "area": area,
                        "summary": summary,
                        "chart_data": price_trends,
                        "table_data": area_data.to_dict('records')
                    }
            
            return {"error": "Area not found in the query."}
        
        # Case 2: Compare areas
        elif "compare" in query:
            areas_to_compare = []
            for area in self.data_processor.get_areas():
                if area.lower() in query:
                    areas_to_compare.append(area)
            
            if len(areas_to_compare) >= 2:
                comparison = self.data_processor.compare_areas(areas_to_compare)
                
                # Get filtered data for table
                filtered_data = pd.DataFrame()
                for area in areas_to_compare:
                    filtered_data = pd.concat([filtered_data, self.data_processor.filter_by_area(area)])
                
                return {
                    "type": "comparison",
                    "areas": areas_to_compare,
                    "chart_data": comparison,
                    "table_data": filtered_data.to_dict('records')
                }
            
            return {"error": "Could not identify areas to compare."}
        
        # Case 3: Price growth for specific area
        elif "price" in query and "growth" in query:
            for area in self.data_processor.get_areas():
                if area.lower() in query:
                    # Extract years if specified
                    years = 3  # default
                    if "last" in query and "years" in query:
                        # Try to extract number of years
                        import re
                        year_match = re.search(r'last\s+(\d+)\s+years', query)
                        if year_match:
                            years = int(year_match.group(1))
                    
                    price_trends = self.data_processor.get_price_trends(area)
                    
                    # Filter to last N years if needed
                    if len(price_trends["price_trends"]) > years:
                        price_trends["price_trends"] = price_trends["price_trends"][-years:]
                    
                    # Get filtered data for the area
                    area_data = self.data_processor.filter_by_area(area)
                    
                    return {
                        "type": "price_growth",
                        "area": area,
                        "years": years,
                        "chart_data": price_trends,
                        "table_data": area_data.to_dict('records')
                    }
            
            return {"error": "Area not found in the query."}
        
        # Default case: Unknown query
        return {"error": "I couldn't understand your query. Try asking about a specific area or comparing areas."}