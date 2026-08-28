def test_recommendations_endpoint(client, auth_headers):
    res = client.get('/api/recommendations', headers=auth_headers)
    assert res.status_code == 200
    data = res.get_json()
    assert data['success'] is True
    assert 'recommendations' in data['data']
    assert len(data['data']['recommendations']) > 0
