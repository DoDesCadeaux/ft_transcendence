from django.urls import path
from django.views.decorators.csrf import csrf_exempt
from . import views

urlpatterns = [
    path('accueil/', views.accueil, name='index'),
    path('pong/', views.pong_test, name='pong_test'),
    path('ajax/data/', views.ajax_data_view, name='ajax_data'),
]

