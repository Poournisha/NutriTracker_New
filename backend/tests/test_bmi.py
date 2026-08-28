from app.services.bmi_service import calculate_bmi

def test_bmi_calculation_normal():
    res = calculate_bmi(175.0, 70.0)
    assert res['bmi'] == 22.9
    assert res['category'] == "Normal"

def test_bmi_calculation_underweight():
    res = calculate_bmi(180.0, 50.0)
    assert res['bmi'] == 15.4
    assert res['category'] == "Underweight"

def test_bmi_calculation_overweight():
    res = calculate_bmi(160.0, 75.0)
    assert res['bmi'] == 29.3
    assert res['category'] == "Overweight"

def test_bmi_calculation_invalid():
    res = calculate_bmi(0, 0)
    assert res['bmi'] is None
    assert res['category'] == "Unknown"
