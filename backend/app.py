import numpy as np
import pandas as pd
import joblib
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

# Load models at startup
try:
    nifty_model = joblib.load('./models/nifty_prophet_model.pkl')
    bond_model = joblib.load('./models/bonds_prophet_model.pkl')
    bitcoin_model = joblib.load('./models/bitcoin_prophet_model.pkl')
    print("Models loaded successfully.")
except Exception as e:
    print("Error loading models:", e)
    exit(1)  # Exit if models cannot be loaded

def generate_predictions(nifty_model, bond_model, bitcoin_model, num_days):
    """Generate predictions for Nifty, bonds, and Bitcoin."""
    future_dates = pd.date_range(start=datetime.today(), periods=num_days).to_frame(index=False, name='ds')
    
    try:
        nifty_predictions = nifty_model.predict(future_dates)
        bond_predictions = bond_model.predict(future_dates)
        bitcoin_predictions = bitcoin_model.predict(future_dates)
    except Exception as e:
        print("Error during prediction:", e)
        raise

    # Calculate changes for Nifty
    closing_prices = nifty_predictions['yhat'].values
    nifty_changes = np.diff(closing_prices, prepend=closing_prices[0]) / closing_prices[0] * 100

    # Check for 'yhat' in bond predictions
    if 'yhat' not in bond_predictions.columns:
        raise KeyError("'yhat' column not found in Bond predictions.")
    bond_prices = bond_predictions['yhat'].values
    bond_changes = np.diff(bond_prices, prepend=bond_prices[0]) / bond_prices[0] * 100

    # Check for 'yhat' in Bitcoin predictions
    if 'yhat' not in bitcoin_predictions.columns:
        raise KeyError("'yhat' column not found in Bitcoin predictions.")
    bitcoin_prices = bitcoin_predictions['yhat'].values
    bitcoin_changes = np.diff(bitcoin_prices, prepend=bitcoin_prices[0]) / bitcoin_prices[0] * 100

    return nifty_changes, bond_changes, bitcoin_changes

def simulate_investment(initial_investment, risk_tolerance, nifty_changes, bond_changes, bitcoin_changes):
    """Simulate investment returns based on risk tolerance and investment strategies."""
    bank_return = 0.065
    mutual_fund_return = 0.10

    # Initialize investment values
    investment_values = {
        'bank': 0,
        'mutual_fund': 0,
        'bonds': 0,
        'nifty': 0,
        'bitcoin': 0
    }

    # Allocate investments based on risk tolerance
    if risk_tolerance == 'low':
        investment_values['bank'] = initial_investment * 0.45  # Increased allocation to bank
        investment_values['bonds'] = initial_investment * 0.30
        investment_values['mutual_fund'] = initial_investment * 0.25
          # Small allocation to Nifty
          # Small allocation to Bitcoin
    elif risk_tolerance == 'medium':
        investment_values['bank'] = initial_investment * 0.20
        investment_values['mutual_fund'] = initial_investment * 0.40
        investment_values['bonds'] = initial_investment * 0.10
        investment_values['nifty'] = initial_investment * 0.25 # Small allocation to Nifty
        investment_values['bitcoin'] = initial_investment * 0.05 # Small allocation to Bitcoin
    elif risk_tolerance == 'high':
        investment_values['bank'] = initial_investment * 0.10
        investment_values['mutual_fund'] = initial_investment * 0.35
        investment_values['nifty'] = initial_investment * 0.35
        investment_values['bitcoin'] = initial_investment * 0.10
        investment_values['bonds'] = initial_investment * 0.10

    investment_duration = len(nifty_changes)
    monthly_investment_values = []

    # Simulate investment growth
    for day in range(investment_duration):
        investment_values['bank'] *= (1 + bank_return / 365)
        investment_values['mutual_fund'] *= (1 + mutual_fund_return / 365)
        
        investment_values['bonds'] *= (1 + bond_changes[day] / 100)
        investment_values['nifty'] *= (1 + nifty_changes[day] / 100)
        investment_values['bitcoin'] *= (1 + bitcoin_changes[day] / 100)

        # Capture monthly values
        if (day + 1) % 30 == 0:
            total_investment_value = sum(investment_values.values())
            monthly_investment_values.append(total_investment_value)

    final_investment_value = sum(investment_values.values())
    total_returns = final_investment_value - initial_investment

    return {
        'final_investment_value': final_investment_value,
        'total_returns': total_returns,
        'monthly_values': monthly_investment_values,
        'investment_breakdown': investment_values
    }

@app.route('/simulate', methods=['POST'])
def simulate():
    data = request.json
    initial_investment = data['initial_investment']
    risk_tolerance = data['risk_tolerance']
    num_days = data['num_days']

    # Generate predictions
    nifty_changes, bond_changes, bitcoin_changes = generate_predictions(nifty_model, bond_model, bitcoin_model, num_days)

    # Simulate investment returns
    results = simulate_investment(initial_investment, risk_tolerance, nifty_changes, bond_changes, bitcoin_changes)
    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True)
