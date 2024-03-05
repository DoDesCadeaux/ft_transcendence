from django.urls import path
from .views import UserUpdateAPIView

urlpatterns = [
    path('update_user/<str:id_api>/', UserUpdateAPIView.as_view(), name='update_user'),
]