from functools import wraps
from rest_framework.response import Response
from rest_framework import status


def api_response(message="Success", error_message="Error"):

    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            try:
                result = func(*args, **kwargs)

                # If the view already returns a Response, just pass it
                if isinstance(result, Response):
                    return Response({
                        "status": True,
                        "message": message,
                        "data": result.data
                    }, status=result.status_code)

                # Otherwise, return as data
                return Response({
                    "status": True,
                    "message": message,
                    "data": result
                }, status=status.HTTP_200_OK)

            except Exception as e:
                # Catch exceptions and return standardized error response
                return Response({
                    "status": False,
                    "message": str(e) or error_message,
                    "data": None
                }, status=status.HTTP_400_BAD_REQUEST)

        return wrapper

    return decorator
