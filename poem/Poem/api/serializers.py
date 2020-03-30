from rest_framework import serializers

from Poem.poem import models
from Poem.poem_super_admin.models import Probe
from Poem.users.models import CustUser


class AggregationProfileSerializer(serializers.ModelSerializer):
    class Meta:
        fields = ('name', 'description', 'apiid', 'groupname')
        model = models.Aggregation


class MetricProfileSerializer(serializers.ModelSerializer):
    class Meta:
        fields = ('name', 'description', 'apiid', 'groupname', )
        model = models.MetricProfiles


class ServiceFlavourSerializer(serializers.ModelSerializer):
    class Meta:
        fields = ('name', 'description', )
        model = models.ServiceFlavour


class UsersSerializer(serializers.ModelSerializer):
    class Meta:
        fields = ('first_name', 'last_name', 'username', 'is_active',
                  'is_superuser', 'email', 'date_joined', 'pk')
        model = CustUser


class MetricInstanceSerializer(serializers.ModelSerializer):
    class Meta:
        fields = ('service_flavour', 'metric')
        model = models.MetricInstance


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        fields = ('subject', 'egiid', 'displayname')
        model = models.UserProfile


class ProbeSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        return Probe.objects.create(**validated_data)

    class Meta:
        model = Probe
        fields = '__all__'


class ThresholdsProfileSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        return models.ThresholdsProfiles.objects.create(**validated_data)

    class Meta:
        fields = ('name', 'description', 'apiid', 'groupname',)
        model = models.ThresholdsProfiles
