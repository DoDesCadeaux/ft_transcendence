from django.shortcuts import render

# Create your views here.

def index(request):
    return render(request, "dashboard.html")


def profile(request):
    return render(request, "profile.html")

def game(request):
    return render(request, "game.html")