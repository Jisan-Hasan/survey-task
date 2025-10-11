from django.urls import path, include

from users.views import LoginView, LogoutView, TokenRefresh,UserProfileView,UserListCreateView,UserDetailView

urlpatterns = [
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/refresh/', TokenRefresh.as_view(), name='token_refresh'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),

    path('users/', UserListCreateView.as_view(), name='user-list-create'),
    path('users/<int:pk>/', UserDetailView.as_view(), name='user-detail'),

    path('surveys/', include('surveys.urls'))
]
