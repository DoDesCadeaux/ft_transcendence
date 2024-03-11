from django.urls import path, include

from . import views

urlpatterns = [
	path("", views.index, name="dashboard"),
	path("profile/", views.profile, name='profile'),
	path("game/", views.game, name='game'),
	path('login/', views.login, name='login'),
	path('logout/', views.logout, name='logout'),
	path('api/', include('api_transcendence.urls')),
	path('dashboard_fragment/', views.dashboard_fragment, name='dashboard_fragment'),
	path('game_fragment/', views.game_fragment, name='game_fragment'),
	path('profile_fragment/', views.profile_fragment, name='profile_fragment'),
	path('tournament_fragment/', views.tournament_fragment, name='tournament_fragment'),
 

]
