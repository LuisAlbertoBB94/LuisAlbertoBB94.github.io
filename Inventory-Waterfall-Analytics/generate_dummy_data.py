import pandas as pd
import numpy as np
import random
import os

def generate_inventory_data():
    """
    Generates dummy internal inventory data to safely demonstrate the
    waterfall (burn-down) mechanism without exposing real company metrics.
    """
    np.random.seed(42)
    random.seed(42)
    
    locations = ["LOC-Alpha", "LOC-Beta", "LOC-Gamma", "LOC-Delta"]
    categories = ["Electronics", "Apparel", "Home & Garden", "Sports", "Toys"]
    
    num_records = 500
    
    data = []
    
    for _ in range(num_records):
        loc = random.choice(locations)
        cat = random.choice(categories)
        item_id = f"ITM-{random.randint(1000, 9999)}"
        
        # Monthly goal of items to sell
        monthly_target_units = random.randint(50, 2000)
        
        # Unit price in generic currency
        unit_price = round(random.uniform(5.0, 500.0), 2)
        
        # We need a mix of overstocked and understocked items to see the waterfall properly
        stock_ratio = random.uniform(0.1, 1.5) # stock covers between 10% and 150% of the month
        current_stock = int(monthly_target_units * stock_ratio)
        
        data.append({
            "LocationID": loc,
            "Category": cat,
            "ItemCode": item_id,
            "MonthlyTargetUnits": monthly_target_units,
            "UnitPrice": unit_price,
            "CurrentStockUnits": current_stock
        })
        
    df = pd.DataFrame(data)
    
    # Save the file to the same directory
    output_path = os.path.join(os.path.dirname(__file__), "inventory_status.csv")
    df.to_csv(output_path, index=False)
    print(f"[OK] Successfully generated dummy data with {num_records} items at {output_path}")

if __name__ == "__main__":
    generate_inventory_data()
