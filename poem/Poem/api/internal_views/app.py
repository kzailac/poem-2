from django.conf import settings
from django.db import connection

from Poem.api.internal_views.users import get_all_groups, get_groups_for_user
from Poem.poem.saml2.config import tenant_from_request, saml_login_string

from rest_framework.authentication import SessionAuthentication
from rest_framework.response import Response
from rest_framework.views import APIView

from tenant_schemas.utils import get_public_schema_name


class ListGroupsForUser(APIView):
    authentication_classes = (SessionAuthentication,)

    def get(self, request, group=None):
        user = request.user

        if user.is_superuser:
            results = get_all_groups()

        else:
            results = get_groups_for_user(user)

        if group:
            return Response(results[group.lower()])
        else:
            return Response({'result': results})


class GetConfigOptions(APIView):
    authentication_classes = ()
    permission_classes = ()

    def get(self, request):
        options = dict()

        tenant = tenant_from_request(request)
        options.update(saml_login_string=saml_login_string(tenant))

        options.update(webapimetric=settings.WEBAPI_METRIC)
        options.update(webapiaggregation=settings.WEBAPI_AGGREGATION)
        options.update(tenant_name=tenant)

        return Response({'result': options})


class GetPoemVersion(APIView):
    authentication_classes = ()
    permission_classes = ()

    def get(self, request):
        schema = connection.schema_name

        if schema == get_public_schema_name():
            resp = 'superadmin'
        else:
            resp = 'tenant'

        return Response({'schema': resp})
