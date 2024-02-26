from django.shortcuts import render, get_object_or_404
from django.shortcuts import redirect
from django.http import HttpResponse
from django.conf import settings
from app.models import User
import requests, json
import os

# Create your views here.

def index(request):
    return render(request, "dashboard.html")


def profile(request):
    utilisateur = get_object_or_404(User, username="dduraku")
    return render(request, "profile.html", {'utilisateur': utilisateur})

def game(request):
    return render(request, "game.html")


def authorize(request):
    CLIENT_ID = settings.CLIENT_ID
    REDIRECT_URI = settings.REDIRECT_URI
    auth_url = f"https://api.intra.42.fr/oauth/authorize?client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}&response_type=code"
    return redirect(auth_url)

def connexion(request):
    CLIENT_ID = settings.CLIENT_ID
    code = request.GET.get('code')
    if code:
        data = {
            'grant_type': 'authorization_code',
            'client_id': CLIENT_ID,
            'client_secret': settings.CLIENT_SECRET,
            'code': code,
            'redirect_uri': settings.REDIRECT_URI
        }
        # Effectuer la demande POST pour obtenir le token d'accès
        response = requests.post('https://api.intra.42.fr/oauth/token', data=data)
        # Vérifier si la requête a réussi
        if response.status_code == 200:
            # Extraire le token d'accès de la réponse JSON
            token_info = response.json()
            access_token = token_info.get('access_token')
            # Utiliser le token d'accès pour obtenir des informations sur l'utilisateur depuis l'API 42
            headers = {'Authorization': f'Bearer {access_token}'}
            user_info_response = requests.get('https://api.intra.42.fr/v2/me', headers=headers)
            # Vérifier si la requête pour obtenir les informations de l'utilisateur a réussi
            if user_info_response.status_code == 200:
                # Extraire les informations de l'utilisateur de la réponse JSON
                user_info = json.loads(user_info_response.text)
                # Ici, vous pouvez traiter les informations de l'utilisateur selon vos besoins
                user_name = user_info.get('login')
                user_photo_url = user_info.get('image', {}).get('versions', {}).get('large')
                id42 = user_info.get('id')
                # Vous pouvez passer ces informations à votre modèle et les afficher dans votre template
                # Retourner une réponse avec les informations de l'utilisateur
                cookie = request.COOKIES.get('token', None)
                # response = HttpResponse(f"{user_info}")
                response = HttpResponse(f"Nom de l'utilisateur : {user_name}<br><img src='{user_photo_url}'><br> id : {id42}")
                if cookie is None:
                    response.set_cookie(key='token', value=access_token)
                return response
            else:
                return HttpResponse("Failed to retrieve user information", status=user_info_response.status_code)
        else:
            return HttpResponse("Failed to retrieve access token", status=response.status_code)
    else:
        return HttpResponse("No code provided or error occurred")
