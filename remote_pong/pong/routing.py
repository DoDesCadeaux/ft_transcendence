from channels.routing import ProtocolTypeRouter, URLRouter
from django.urls import path
from . import consumers

websocket_urlpatterns = [
    # Chemin d'URL WebSocket pour PongConsumer
    # Definit l'utl a laquelle les clients se connecte pour etablir la connexion
    # WS avec le consumer PongConsumer
    path('ws/pong/', consumers.PongConsumer.as_asgi()),
]

application = ProtocolTypeRouter({
    'websocket': URLRouter(
        websocket_urlpatterns
    ),
})