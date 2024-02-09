from rest_framework import serializers
from api.models import *

class OwnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Owners
        fields = ['owner_id', 'first_name', 'last_name', 'username']

class ExperimentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experiments
        fields = ['experiment_id', 'experiment_name']

class ObservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Observations
        fields = ['observation_id', 'observation_name']

class VariableSerializer(serializers.ModelSerializer):
    class Meta:
        model = Variables
        fields = ['variable_id', 'variable_name', 'channel']

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Groups
        fields = ['group_id', 'group_name']

class PlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plots
        fields = ['plot_id', 'div', 'script']