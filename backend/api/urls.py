from django.urls import path
from . import views

urlpatterns = [
    path('auth/login/', views.AdminLoginView.as_view()),
    path('auth/setup/', views.AdminSetupView.as_view()),
    path('auth/password/', views.AdminPasswordView.as_view()),
    path('admin/exists/', views.AdminExistsView.as_view()),
    
    path('applicants/', views.ApplicantListCreateView.as_view()),
    path('applicants/<str:pk>/', views.ApplicantDetailView.as_view()),
    path('applicants/<str:pk>/status/', views.ApplicantDetailView.as_view()), # Using same view for patch
    
    path('site-settings/', views.SiteSettingsView.as_view()),
    
    path('comments/', views.StudentCommentListCreateView.as_view()),
    path('comments/<str:pk>/', views.StudentCommentDetailView.as_view()),
    
    path('vault/', views.SavedPasswordListCreateView.as_view()),
    path('vault/<str:pk>/', views.SavedPasswordDetailView.as_view()),

    path('courses/', views.CourseListCreateView.as_view()),
    path('courses/<str:pk>/', views.CourseDetailView.as_view()),
]
