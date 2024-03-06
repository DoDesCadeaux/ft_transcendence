from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods

# Create your views here.

def pong_test(request):
    return render(request, 'pong/pong_test.html')

def accueil(request):
    return render(request, 'pong/index.html')

@require_http_methods(["GET"])
def ajax_data_view(request):
    data = {"message": "This is a JSON response from the server!"}
    return JsonResponse(data)