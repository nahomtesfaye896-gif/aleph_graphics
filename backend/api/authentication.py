from rest_framework import authentication
from rest_framework import exceptions
from django.core import signing
from .models import AdminUser

class AdminTokenAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return None

        try:
            prefix, token = auth_header.split(' ')
            if prefix.lower() != 'bearer':
                return None
        except ValueError:
            return None

        try:
            payload = signing.loads(token, max_age=86400) # 1 day expiry
            username = payload.get('username')
            user = AdminUser.objects.get(username=username)
        except signing.SignatureExpired:
            raise exceptions.AuthenticationFailed('Token has expired')
        except signing.BadSignature:
            raise exceptions.AuthenticationFailed('Invalid token signature')
        except AdminUser.DoesNotExist:
            raise exceptions.AuthenticationFailed('No such user')

        # Since AdminUser isn't a standard django User, we attach it to request.admin_user
        # and return a mock user so DRF's IsAuthenticated passes.
        class MockUser:
            is_authenticated = True
        
        request.admin_user = user
        return (MockUser(), None)
