import pytest

@pytest.fixture
def mock_user():
    return {
        "id": "usr_123",
        "email": "test@vynta.ai",
        "name": "Test User",
        "role": "USER",
    }
