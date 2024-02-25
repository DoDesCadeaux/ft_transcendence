from django.shortcuts import render, get_object_or_404
from app.models import User

# Create your views here.

def index(request):
    return render(request, "dashboard.html")


def profile(request):
    utilisateur = get_object_or_404(User, username="dduraku")
    return render(request, "profile.html", {'utilisateur': utilisateur})

def game(request):
    return render(request, "game.html")
