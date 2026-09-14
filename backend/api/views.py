from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.core import signing
from django.db import transaction
import base64
import hashlib
from .models import AdminUser, Applicant, SiteSettings, SavedPassword, StudentComment, Course
from .serializers import (
    AdminUserSerializer, ApplicantSerializer, SiteSettingsSerializer,
    SavedPasswordSerializer, StudentCommentSerializer, CourseSerializer
)

# PBKDF2 hashing functions from frontend's crypto.ts ported to Python
import os

def fallback_digest(input_str: str) -> str:
    h1 = 0xdeadbeef
    h2 = 0x41c6ce57
    for char in input_str:
        ch = ord(char)
        h1 = (h1 ^ ch) * 2654435761 & 0xFFFFFFFF
        h2 = (h2 ^ ch) * 1597334677 & 0xFFFFFFFF
    
    h1 = (h1 ^ (h1 >> 16)) * 2246822507 & 0xFFFFFFFF
    h1 = h1 ^ ((h2 ^ (h2 >> 13)) * 3266489909 & 0xFFFFFFFF)
    
    h2 = (h2 ^ (h2 >> 16)) * 2246822507 & 0xFFFFFFFF
    h2 = h2 ^ ((h1 ^ (h1 >> 13)) * 3266489909 & 0xFFFFFFFF)
    
    return f"{h2:08x}{h1:08x}"

def verify_password(password: str, salt_b64: str, expected_hash: str) -> bool:
    try:
        salt = base64.b64decode(salt_b64)
        derived = hashlib.pbkdf2_hmac('sha256', password.encode(), salt, 100000, dklen=32)
        derived_b64 = base64.b64encode(derived).decode()
        if derived_b64 == expected_hash:
            return True
        # Try fallback
        return fallback_digest(f"{salt_b64}:{password}") == expected_hash
    except Exception:
        return False

def hash_password(password: str):
    salt = os.urandom(16)
    derived = hashlib.pbkdf2_hmac('sha256', password.encode(), salt, 100000, dklen=32)
    return base64.b64encode(derived).decode(), base64.b64encode(salt).decode()

class AdminExistsView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        exists = AdminUser.objects.exists()
        return Response({'exists': exists})

class AdminSetupView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        if AdminUser.objects.exists():
            return Response({'error': 'ADMIN_EXISTS'}, status=status.HTTP_400_BAD_REQUEST)
        
        username = request.data.get('username')
        password = request.data.get('password')
        if not username or not password:
            return Response({'error': 'Username and password required'}, status=status.HTTP_400_BAD_REQUEST)
        
        username = username.strip().lower()
        pass_hash, salt = hash_password(password)
        
        user = AdminUser.objects.create(
            username=username,
            password_hash=pass_hash,
            salt=salt
        )
        return Response({'status': 'ok'})

class AdminLoginView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        username = request.data.get('username', '').strip().lower()
        password = request.data.get('password', '')
        
        try:
            user = AdminUser.objects.get(username=username)
            if verify_password(password, user.salt, user.password_hash):
                token = signing.dumps({'username': user.username})
                return Response({'token': token, 'user': AdminUserSerializer(user).data})
        except AdminUser.DoesNotExist:
            pass
            
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class AdminPasswordView(APIView):
    permission_classes = [IsAuthenticated]
    def put(self, request):
        user = getattr(request, 'admin_user', None)
        if not user:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
            
        new_password = request.data.get('newPassword')
        if not new_password:
            return Response({'error': 'newPassword required'}, status=status.HTTP_400_BAD_REQUEST)
            
        pass_hash, salt = hash_password(new_password)
        user.password_hash = pass_hash
        user.salt = salt
        user.save()
        return Response({'status': 'ok'})

class ApplicantListCreateView(APIView):
    def get_permissions(self):
        if self.request.method == 'POST':
            return [AllowAny()]
        return [IsAuthenticated()]
        
    def get(self, request):
        applicants = Applicant.objects.all().order_by('-created_at')
        serializer = ApplicantSerializer(applicants, many=True)
        return Response(serializer.data)
        
    def post(self, request):
        serializer = ApplicantSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ApplicantDetailView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get_object(self, name_or_id):
        try:
            return Applicant.objects.get(id=name_or_id)
        except (Applicant.DoesNotExist, ValueError):
            try:
                return Applicant.objects.get(name=name_or_id)
            except Applicant.DoesNotExist:
                return None

    def patch(self, request, pk):
        applicant = self.get_object(pk)
        if not applicant:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        if 'status' in request.data:
            applicant.status = request.data['status']
            applicant.save()
            return Response(ApplicantSerializer(applicant).data)
        return Response({'error': 'Status required'}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        applicant = self.get_object(pk)
        if not applicant:
            return Response(status=status.HTTP_404_NOT_FOUND)
        applicant.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class SiteSettingsView(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get(self, request):
        settings, _ = SiteSettings.objects.get_or_create(id=1)
        return Response(SiteSettingsSerializer(settings).data)
        
    def put(self, request):
        settings, _ = SiteSettings.objects.get_or_create(id=1)
        
        # We handle camelCase to snake_case mapping here if needed, but serializer can handle it
        # Actually serializer fields like phoneRaw map to phone_raw. Let's just pass data.
        serializer = SiteSettingsSerializer(settings, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    def delete(self, request):
        SiteSettings.objects.filter(id=1).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class StudentCommentListCreateView(APIView):
    def get_permissions(self):
        if self.request.method == 'POST':
            return [AllowAny()]
        return [AllowAny()] # GET is also public, we'll filter in frontend or backend
        
    def get(self, request):
        comments = StudentComment.objects.all().order_by('-created_at')
        return Response(StudentCommentSerializer(comments, many=True).data)
        
    def post(self, request):
        import uuid
        data = request.data.copy()
        if 'id' not in data:
            data['id'] = f"comment-{str(uuid.uuid4())[:8]}"
            
        serializer = StudentCommentSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class StudentCommentDetailView(APIView):
    permission_classes = [IsAuthenticated]
    
    def patch(self, request, pk):
        try:
            comment = StudentComment.objects.get(id=pk)
            if 'approved' in request.data:
                comment.approved = request.data['approved']
                comment.save()
            return Response(StudentCommentSerializer(comment).data)
        except StudentComment.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
            
    def delete(self, request, pk):
        try:
            StudentComment.objects.get(id=pk).delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except StudentComment.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

class SavedPasswordListCreateView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        passwords = SavedPassword.objects.all().order_by('-created_at')
        return Response(SavedPasswordSerializer(passwords, many=True).data)
        
    def post(self, request):
        serializer = SavedPasswordSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SavedPasswordDetailView(APIView):
    permission_classes = [IsAuthenticated]
    
    def delete(self, request, pk):
        try:
            SavedPassword.objects.get(id=pk).delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except SavedPassword.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

class CourseListCreateView(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get(self, request):
        courses = Course.objects.all()
        return Response(CourseSerializer(courses, many=True).data)

    def post(self, request):
        serializer = CourseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CourseDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        try:
            course = Course.objects.get(id=pk)
        except Course.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = CourseSerializer(course, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            Course.objects.get(id=pk).delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Course.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

