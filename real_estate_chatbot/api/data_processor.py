import pandas as pd
import json
from typing import Dict, List, Any

class RealEstateDataProcessor:
    """Process real estate data from Excel file."""
    
    def __init__(self, file_path=None, dataframe=None):
        """Initialize with either a file path or a pandas DataFrame."""
        if dataframe is not None:
            self.df = dataframe
        elif file_path:
            self.df = pd.read_csv(file_path)
            # Clean data - remove commas, convert to proper types
            self._clean_data()
        else:
            raise ValueError("Either file_path or dataframe must be provided")
    
    def _clean_data(self):
        """Clean the data by removing commas and converting to proper types."""
        # Extract numeric values from columns with commas and quotes
        for col in self.df.columns:
            if self.df[col].dtype == 'object':
                try:
                    # Try to convert string numbers with commas to float
                    self.df[col] = self.df[col].str.replace(',', '').str.replace('"', '').astype(float)
                except:
                    pass
    
    def get_areas(self) -> List[str]:
        """Get list of unique areas."""
        return self.df['final location'].unique().tolist()
    
    def filter_by_area(self, area: str) -> pd.DataFrame:
        """Filter data by area name."""
        return self.df[self.df['final location'] == area]
    
    def get_price_trends(self, area: str) -> Dict[str, Any]:
        """Get price trends for an area over years."""
        area_data = self.filter_by_area(area)
        if area_data.empty:
            return {"error": f"No data found for area: {area}"}
        
        # Get flat prices over years
        result = []
        for _, row in area_data.iterrows():
            result.append({
                "year": row['year'],
                "flat_price": row[' flat - weighted average rate '],
                "office_price": row[' office - weighted average rate '],
                "shop_price": row[' shop - weighted average rate '],
                "total_sales": row[' total_sales - igr '],
                "units_sold": row['total sold - igr']
            })
        
        return {
            "area": area,
            "price_trends": result
        }
    
    def compare_areas(self, areas: List[str]) -> Dict[str, Any]:
        """Compare multiple areas based on prices and demand."""
        result = {"areas": areas, "comparison": []}
        
        for area in areas:
            area_data = self.filter_by_area(area)
            if area_data.empty:
                continue
                
            area_trend = []
            for _, row in area_data.iterrows():
                area_trend.append({
                    "year": row['year'],
                    "price": row[' flat - weighted average rate '],
                    "demand": row['total sold - igr']
                })
            
            result["comparison"].append({
                "area": area,
                "data": area_trend
            })
        
        return result
    
    def generate_summary(self, area: str) -> str:
        """Generate a mock summary for an area."""
        area_data = self.filter_by_area(area)
        if area_data.empty:
            return f"No data found for {area}."
        
        # Sort by year to get first and last year
        area_data = area_data.sort_values('year')
        first_year = area_data.iloc[0]
        last_year = area_data.iloc[-1]
        
        # Calculate price change
        price_first = first_year[' flat - weighted average rate ']
        price_last = last_year[' flat - weighted average rate ']
        price_change = ((price_last - price_first) / price_first) * 100
        
        # Calculate demand change
        demand_first = first_year['total sold - igr']
        demand_last = last_year['total sold - igr']
        demand_change = ((demand_last - demand_first) / demand_first) * 100
        
        summary = f"""
        Summary for {area}:
        
        From {first_year['year']} to {last_year['year']}, property prices have {'increased' if price_change > 0 else 'decreased'} by {abs(price_change):.2f}%.
        The average flat price is now ₹{price_last:.2f} per sq ft compared to ₹{price_first:.2f} in {first_year['year']}.
        
        Market demand has {'grown' if demand_change > 0 else 'declined'} by {abs(demand_change):.2f}%, with {int(demand_last)} units sold in {last_year['year']} compared to {int(demand_first)} in {first_year['year']}.
        
        The latest data from {last_year['year']} shows a total of {int(last_year['total units'])} available units, with a total sales value of ₹{last_year[' total_sales - igr ']:.2f}.
        """
        
        return summary.strip()