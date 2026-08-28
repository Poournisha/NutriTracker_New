def test_register_success(client):
    res = client.post('/api/auth/register', json={
        'name': 'New Student',
        'email': 'newstudent@nutrimeasure.ai',
        'password': 'StrongPassword123!'
    })
    assert res.status_code == 201
    data = res.get_json()
    assert data['success'] is True
    assert 'token' in data['data']
    assert data['data']['user']['email'] == 'newstudent@nutrimeasure.ai'

def test_register_duplicate_email(client):
    client.post('/api/auth/register', json={
        'name': 'Student A',
        'email': 'duplicate@nutrimeasure.ai',
        'password': 'Password123!'
    })
    res = client.post('/api/auth/register', json={
        'name': 'Student B',
        'email': 'duplicate@nutrimeasure.ai',
        'password': 'Password123!'
    })
    assert res.status_code == 400
    assert res.get_json()['success'] is False

def test_login_success(client):
    client.post('/api/auth/register', json={
        'name': 'Login User',
        'email': 'login@nutrimeasure.ai',
        'password': 'Password123!'
    })
    res = client.post('/api/auth/login', json={
        'email': 'login@nutrimeasure.ai',
        'password': 'Password123!'
    })
    assert res.status_code == 200
    assert 'token' in res.get_json()['data']

def test_login_invalid_password(client):
    client.post('/api/auth/register', json={
        'name': 'Login User',
        'email': 'wrongpass@nutrimeasure.ai',
        'password': 'CorrectPassword123!'
    })
    res = client.post('/api/auth/login', json={
        'email': 'wrongpass@nutrimeasure.ai',
        'password': 'WrongPassword123!'
    })
    assert res.status_code == 401
