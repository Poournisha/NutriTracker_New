def test_create_and_get_meal(client, auth_headers):
    # Save meal
    save_res = client.post('/api/meals', headers=auth_headers, json={
        'meal_type': 'Breakfast',
        'items': [
            {'food_name': 'Dosa', 'estimated_grams': 120, 'portion_category': 'Medium', 'confidence': 0.94},
            {'food_name': 'Sambar', 'estimated_grams': 150, 'portion_category': 'Medium', 'confidence': 0.91}
        ]
    })
    assert save_res.status_code == 201
    meal_id = save_res.get_json()['data']['meal']['id']

    # Get meals list
    list_res = client.get('/api/meals', headers=auth_headers)
    assert list_res.status_code == 200
    meals = list_res.get_json()['data']['meals']
    assert len(meals) == 1
    assert meals[0]['id'] == meal_id

    # Delete meal
    del_res = client.delete(f'/api/meals/{meal_id}', headers=auth_headers)
    assert del_res.status_code == 200
