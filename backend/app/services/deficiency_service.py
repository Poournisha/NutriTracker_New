from typing import List, Dict, Any

def detect_nutrient_deficiencies(intake: Dict[str, float], targets: Dict[str, float]) -> List[Dict[str, Any]]:
    """
    Evaluates daily nutrient intake against target levels and returns deficiency warnings.
    Returns list of deficiency objects with nutrient, severity (LOW, MEDIUM, HIGH), and non-medical alert message.
    """
    deficiencies = []
    
    # Nutrients to audit
    nutrients_to_check = [
        ("protein", "Protein", "g"),
        ("iron", "Iron", "mg"),
        ("calcium", "Calcium", "mg")
    ]

    for key, label, unit in nutrients_to_check:
        consumed = intake.get(key, 0.0)
        target = targets.get(f"{key}_target", 1.0)
        if target <= 0:
            continue
            
        ratio = consumed / target

        if ratio < 0.40:
            severity = "HIGH"
            msg = f"Your daily dietary intake for {label} is significantly below target ({round(consumed, 1)}{unit} consumed vs {round(target, 1)}{unit} target)."
            deficiencies.append({
                "nutrient": key,
                "label": label,
                "severity": severity,
                "consumed": round(consumed, 1),
                "target": round(target, 1),
                "ratio_pct": round(ratio * 100, 1),
                "message": msg
            })
        elif ratio < 0.75:
            severity = "MEDIUM"
            msg = f"Your {label} intake is moderately below today's recommended target."
            deficiencies.append({
                "nutrient": key,
                "label": label,
                "severity": severity,
                "consumed": round(consumed, 1),
                "target": round(target, 1),
                "ratio_pct": round(ratio * 100, 1),
                "message": msg
            })
        elif ratio < 0.90:
            severity = "LOW"
            msg = f"Your {label} intake is slightly lower than your target goal."
            deficiencies.append({
                "nutrient": key,
                "label": label,
                "severity": severity,
                "consumed": round(consumed, 1),
                "target": round(target, 1),
                "ratio_pct": round(ratio * 100, 1),
                "message": msg
            })

    return deficiencies
