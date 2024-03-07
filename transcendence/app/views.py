from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.conf import settings
from app.models import User
from django.contrib.auth import logout as auth_logout
from django.contrib.auth import login as auth_login
from datetime import timedelta
import requests
from django.core.files import File
from urllib.request import urlopen
from django.middleware.csrf import get_token
from django.http import HttpResponseRedirect


# Create your views here.
def login(request):
	auth_url = f"https://api.intra.42.fr/oauth/authorize?client_id={settings.CLIENT_ID}&redirect_uri={settings.REDIRECT_URI}&response_type=code"
	return redirect(auth_url)


def connexion(request):
	if request.user.is_authenticated:
		return render(request, "base.html")
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
				user_login = user_info.get('login')
				user_name = user_info.get('first_name')
				user_photo_url = user_info.get('image', {}).get('versions', {}).get('large')
				delta = timedelta(minutes=0)
				response = urlopen(user_photo_url)
				photo_name = f"{user_id42}.jpg"

				user, created = User.objects.get_or_create(
					id_api=user_id42,
					defaults={'name': user_name, 'username': user_login, 'play_time': delta, 'state': "online",
							  'photo': photo_name}
				)
				if not created:
					user.state = "online"
				else:
					user.photo.save(photo_name, File(response))
				user.save()
				auth_login(request, user)
				return render(request, "base.html")
			else:
				return HttpResponse("Failed to retrieve user information", status=user_info_response.status_code)
		else:
			return HttpResponse("Failed to retrieve access token", status=response.status_code)
	else:
		return render(request, "login.html")


def index(request):
	return render(request, "base.html")


def profile(request):
	if request.user.is_authenticated:
		return render(request, "base.html")
	else:
		return redirect("/")


def game(request):
	if request.user.is_authenticated:
		return render(request, "base.html")
	else:
		return redirect("/")


def logout(request):
	access_token = request.session.get('access_token')
	request.session.pop(access_token, None)

	activeUser = request.user
	activeUser.state = "offline"
	activeUser.save()

	auth_logout(request)

	response = HttpResponseRedirect("/")

	for cookie in request.COOKIES:
		response.delete_cookie(cookie)

	csrf_token = get_token(request)
	if csrf_token:
		response.delete_cookie(csrf_token)

	return response


def dashboard_fragment(request):
	return render(request, "dashboard.html")


def game_fragment(request):
	return render(request, "game.html")


def profile_fragment(request):
	return render(request, "profile.html")

