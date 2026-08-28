from app.services.nutrition_service import calculate_daily_targets

class MockUser:
    def __init__(self, weight, height, age, gender, activity_level, fitness_goal):
        self.weight = weight
        self.height = height
        self.age = age
        self.gender = gender
        self.activity_level = activity_level
        self.fitness_goal = fitness_goal

def test_daily_targets_calculation():
    user = MockUser(70.0, 175.0, 22, 'male', 'Moderately Active', 'Muscle Building')
    targets = calculate_daily_targets(user)

    assert targets['calorie_target'] > 2000
    assert targets['protein_target'] == 140.0 # 70kg * 2.0
    assert targets['iron_target'] == 10.0
    assert targets['calcium_target'] == 1000.0
