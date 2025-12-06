import requests
from django.http import JsonResponse

# Résolution DNS automatique dans le cluster Kubernetes
PUSHGATEWAY_URL = "http://pushgateway.default.svc.cluster.local:9091"

def record_frontend_request(request):
    """
    Incrémente un compteur à chaque appel de vue (ex: page d'accueil, login, etc.)
    """
    # Format texte Prometheus (obligatoire : nom + labels + valeur + saut de ligne)
    metric_name = "frontend_requests_total"
    labels = f'path="{request.path}",method="{request.method}",status="{request.resolver_match.func.__name__}"'
    
    metric_text = f'{metric_name}{{{labels}}} 1\n'

    try:
        response = requests.post(
            f"{PUSHGATEWAY_URL}/job/frontend/instance/{request.get_host()}",
            data=metric_text,
            headers={"Content-Type": "text/plain; version=0.0.4"},
            timeout=3
        )
        response.raise_for_status()  # lève une exception si 4xx/5xx
    except Exception as e:
        # Ne jamais casser ton appli à cause des métriques !
        print(f"[Metrics] Push failed: {e}")

    return JsonResponse({"status": "ok", "metric_pushed": True})