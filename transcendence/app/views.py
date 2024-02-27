from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.conf import settings
from app.models import User
from django.contrib.auth import logout as  auth_logout
from django.contrib.auth import login as auth_login
from datetime import timedelta
import requests
from django.core.files import File
from urllib.request import urlopen


# Create your views here.
def login(request):
    auth_url = f"https://api.intra.42.fr/oauth/authorize?client_id={settings.CLIENT_ID}&redirect_uri={settings.REDIRECT_URI}&response_type=code"
    return redirect(auth_url)

def connexion(request):
    code = request.GET.get('code')
    if code:
        data = {
            'grant_type': 'authorization_code',
            'client_id': settings.CLIENT_ID,
            'client_secret': settings.CLIENT_SECRET,
            'code': code,
            'redirect_uri': settings.REDIRECT_URI
        }

        response = requests.post('https://api.intra.42.fr/oauth/token', data=data)

        if response.status_code == 200:
            token_info = response.json()
            access_token = token_info.get('access_token')
            headers = {'Authorization': f'Bearer {access_token}'}
            user_info_response = requests.get('https://api.intra.42.fr/v2/me', headers=headers)

            if user_info_response.status_code == 200:
                user_info = user_info_response.json()
                user_id42 = user_info.get('id')
                user_name = user_info.get('login')
                user_photo_url = user_info.get('image', {}).get('versions', {}).get('large')
                delta = timedelta(minutes=0)
                # Téléchargez la photo depuis l'URL
                response = urlopen(user_photo_url)
                photo_name = f"{user_id42}.jpg"

                user, created = User.objects.get_or_create(
                    id_api=user_id42,
                    defaults={'name': user_name, 'username': user_name, 'play_time': delta, 'state': "online", 'photo': photo_name}
                )
                user.photo.save(photo_name, File(response))
                if not created:
                    user.state = "online"
                user.save()
                auth_login(request, user)
                return render(request, "dashboard.html")
            else:
                return HttpResponse("Failed to retrieve user information", status=user_info_response.status_code)
        else:
            return HttpResponse("Failed to retrieve access token", status=response.status_code)
    else:
        return HttpResponse("No code provided or an error occurred")

def index(request):
    if request.user.is_authenticated:
        return render(request, "dashboard.html")
    else:
        return redirect("/login/")
    
def profile(request):
    if request.user.is_authenticated:
        return render(request, "profile.html")
    else:
        return redirect("/login/")

def game(request):
    if request.user.is_authenticated:
        return render(request, "game.html")
    else:
        return redirect("/login/")

def logout(request):
    auth_logout(request)
    return redirect("/login/")
