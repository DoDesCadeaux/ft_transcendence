from django.urls import path
from .views import *

urlpatterns = [
    path('update_user/<str:id_api>/', UserUpdateAPIView.as_view(), name='update_user'),
    path('users/', UserListAPIView.as_view(), name='user_list'),
    path('results/<str:game>/', ResultsAPIView.as_view(), name='results'),
]