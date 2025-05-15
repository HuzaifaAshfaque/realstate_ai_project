import os
import openai

class LLMSummaryGenerator:
    """Generate real estate summaries using OpenAI API."""
    
    def __init__(self):
        """Initialize with API key."""
        self.api_key = os.environ.get('OPENAI_API_KEY')
        if self.api_key:
            openai.api_key = self.api_key
    
    def available(self):
        """Check if the API is available."""
        return bool(self.api_key)
    
    def generate_summary(self, area_data):
        """Generate a summary of real estate data using OpenAI."""
        if not self.available():
            return "LLM integration not available. Please set OPENAI_API_KEY."
        
        # Convert area data to a concise text format
        prompt_data = self._format_data_for_prompt(area_data)
        
        prompt = f"""
        Based on the following real estate data for {area_data['area']}:
        
        {prompt_data}
        
        Provide a concise analysis of the real estate market in this area, including:
        1. Price trends over the years
        2. Demand patterns (units sold)
        3. Notable changes or anomalies
        4. Any recommendations for potential investors
        
        Keep the analysis brief but informative.
        """
        
        try:
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a real estate market analyst providing concise insights."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=300,
                temperature=0.7
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            return f"Error generating LLM summary: {str(e)}"
    
    def _format_data_for_prompt(self, area_data):
        """Format area data for the prompt."""
        result = []
        for year_data in area_data['price_trends']:
            year = year_data['year']
            flat_price = year_data['flat_price']
            units_sold = year_data['units_sold']
            total_sales = year_data['total_sales']
            
            result.append(f"Year {year}: Price ₹{flat_price:.2f}/sqft, Units sold: {units_sold}, Total sales: ₹{total_sales}")
        
        return "\n".join(result)