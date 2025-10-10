# utils/renderers.py
from rest_framework.renderers import JSONRenderer

class StandardizedJSONRenderer(JSONRenderer):
    """
    Wraps all responses in a standard format:
    {
        "status": true/false,
        "message": "...",
        "data": ...
    }
    """
    def render(self, data, accepted_media_type=None, renderer_context=None):
        response = renderer_context.get('response', None)
        formatted = {
            "status": response.status_code < 400,
            "message": getattr(response, 'message', None) or "Operation Successful",
            "data": data
        }
        return super().render(formatted, accepted_media_type, renderer_context)
