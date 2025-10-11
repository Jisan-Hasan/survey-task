from django.urls import path, include

from users.views import UserListCreateView,UserDetailView

urlpatterns = [
    path('auth/', include('users.urls')),
    path('users/', UserListCreateView.as_view(), name='user-list-create'),
    path('users/<int:pk>/', UserDetailView.as_view(), name='user-detail'),
    path('surveys/', include('surveys.urls'))
]
