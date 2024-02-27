from django.urls import path

from . import views

urlpatterns = [
	path("", views.index, name='dashboard'),
	path("profile/", views.profile, name='profile'),
	path("game/", views.game, name='game'), 
	# path('login/', views.login, name='login'),
    path('callback/', views.connexion, name='callback'),
    path('logout/', views.index, name='logout'),

]

