from django.urls import path
from .views import *

urlpatterns = [
    path('update_user/<str:id_api>/', UserUpdateAPIView.as_view(), name='update_user'),
    path('users/', UserListAPIView.as_view(), name='user_list'),
    path('results/<str:game>/', ResultsAPIView.as_view(), name='results'),
    path('match/<str:action>/', CreateFinishMatchAPIView.as_view(), name='manage_match'),
    path('tournament/<str:action>/', CreateJoinTournamentAPIView.as_view(), name='tournament_match'),
    path('globalData/<str:game>/', DataMatchTournamentAPIView.as_view(), name='data'),
    path('stats/', FullStatsAPIView.as_view(), name='stats'),
    path('user/', UserInfoAPIView.as_view(), name='user_infos'),
    path('notif/<str:action>/', ManageNotifAPIView.as_view(), name='manage_notif'),
    path('checkNotif/<str:action>/', CheckNotifAPIView.as_view(), name='check_notif'),
    
]