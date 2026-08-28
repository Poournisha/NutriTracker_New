import requests
from flask import current_app
from typing import Dict, Any, List

def query_ai_chatbot(user_message: str, context_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Provider abstraction for AI Chatbot.
    Constructs context prompt with user profile, BMI, daily targets, logged intake, and deficiencies.
    If OPENAI_API_KEY is available and CHATBOT_DEMO_MODE=False, sends request to OpenAI.
    Otherwise returns a contextual deterministic response.
    """
    demo_mode = current_app.config.get('CHATBOT_DEMO_MODE', True)
    api_key = current_app.config.get('OPENAI_API_KEY', '')
    provider = current_app.config.get('LLM_PROVIDER', 'openai')

    user = context_data.get('user', {})
    bmi = context_data.get('bmi', {})
    targets = context_data.get('targets', {})
    intake = context_data.get('intake', {})
    deficiencies = context_data.get('deficiencies', [])

    system_prompt = f"""
You are NutriMeasure AI, an intelligent, empathetic nutrition assistant designed primarily for hostel students.
User Context:
- Name: {user.get('name', 'Student')}
- Age: {user.get('age', 'N/A')}, Gender: {user.get('gender', 'N/A')}
- Fitness Goal: {user.get('fitness_goal', 'General Health')}
- Activity Level: {user.get('activity_level', 'Moderately Active')}
- BMI: {bmi.get('bmi', 'N/A')} ({bmi.get('category', 'N/A')})
- Daily Targets: Calories={targets.get('calorie_target')}kcal, Protein={targets.get('protein_target')}g, Carbs={targets.get('carbs_target')}g, Fat={targets.get('fat_target')}g, Iron={targets.get('iron_target')}mg, Calcium={targets.get('calcium_target')}mg
- Today's Consumed Intake: Calories={intake.get('calories', 0)}kcal, Protein={intake.get('protein', 0)}g, Carbs={intake.get('carbs', 0)}g, Fat={intake.get('fat', 0)}g, Iron={intake.get('iron', 0)}mg, Calcium={intake.get('calcium', 0)}mg
- Current Deficiencies: {[d.get('label') for d in deficiencies]}

Safety Rules:
1. Never diagnose medical conditions or claim medical certainty.
2. Recommend professional dietary/medical advice for medical concerns.
3. State clearly that nutritional values are estimates.
4. Keep advice practical for hostel students.
"""

    if not demo_mode and api_key and provider == 'openai':
        try:
            headers = {
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            }
            body = {
                "model": current_app.config.get('LLM_MODEL', 'gpt-3.5-turbo'),
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message}
                ],
                "temperature": 0.7
            }
            res = requests.post("https://api.openai.com/v1/chat/completions", json=body, headers=headers, timeout=10)
            if res.status_code == 200:
                answer = res.json()["choices"][0]["message"]["content"]
                return {
                    "response": answer,
                    "provider": "OpenAI",
                    "is_demo": False
                }
        except Exception as e:
            print(f"[Chatbot] Live API call failed ({e}). Falling back to demo mode.")

    # Contextual Demo Response Generator
    msg_lower = user_message.lower()
    protein_rem = max(0, targets.get('protein_target', 80) - intake.get('protein', 0))
    cal_rem = max(0, targets.get('calorie_target', 2000) - intake.get('calories', 0))
    
    if "dinner" in msg_lower or "tonight" in msg_lower or "eat" in msg_lower:
        if protein_rem > 25:
            reply = f"For dinner tonight, I recommend focusing on protein! You still have ~{round(protein_rem, 1)}g remaining to reach your target. Excellent hostel options include Chapati with Egg Curry, Dal Tadka, or a bowl of Curd."
        elif cal_rem < 300:
            reply = f"You are close to your calorie target today (~{round(cal_rem, 0)} kcal remaining). A light dinner like Vegetable Soup, 2 Idlis with Sambar, or a small portion of Rasam Rice would be ideal."
        else:
            reply = f"Based on your remaining target (~{round(cal_rem, 0)} kcal, ~{round(protein_rem, 1)}g protein), a balanced hostel meal of 2 Chapatis, Dal, and a serving of Vegetable Curry would keep you on track for your {user.get('fitness_goal', 'fitness')} goal."

    elif "protein" in msg_lower:
        reply = f"You've consumed {round(intake.get('protein', 0), 1)}g of protein today out of your {targets.get('protein_target', 90)}g target. To boost protein in the hostel, opt for Eggs, Curd, Milk, Dal, and Paneer dishes."

    elif "iron" in msg_lower or "calcium" in msg_lower:
        reply = f"To meet your iron and calcium needs: Milk and Curd are excellent for Calcium, while Dal, Green Vegetables, and Fruits like Apples provide essential Iron."

    else:
        reply = f"Hello {user.get('name', 'there')}! You have consumed {round(intake.get('calories', 0), 0)} kcal today ({round(intake.get('protein', 0), 1)}g protein). Let me know if you need specific meal suggestions based on your {user.get('fitness_goal', 'health')} goal!"

    reply += "\n\n*Disclaimer: NutriMeasure AI provides estimated dietary guidance and is not a substitute for professional medical advice.*"

    return {
        "response": reply,
        "provider": "Demo AI Assistant",
        "is_demo": True
    }
