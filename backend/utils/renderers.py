
from rest_framework.renderers import JSONRenderer


class StandardizedJSONRenderer(JSONRenderer):
    """
    Wraps all responses in a standard format:
    {
        "status": true/false,
        "message": "...",
        "data": ...,
        "errors": ...
    }
    """

    def render(self, data, accepted_media_type=None, renderer_context=None):
        response = renderer_context.get('response', None)
        status_code = response.status_code

        is_success = status_code < 400
        errors = None

        # Check if the data is a standard rest_framework error dictionary (usually a dict)
        # and the status code indicates an error (4xx or 5xx)
        if not is_success and isinstance(data, dict):
            errors = data
            data = None

        formatted = {
            "status": is_success,
            "message": getattr(response, 'message', None) or (
                "Operation Successful" if is_success else "Operation Failed"
            ),
            "data": data,
            "errors": errors
        }
        return super().render(formatted, accepted_media_type, renderer_context)