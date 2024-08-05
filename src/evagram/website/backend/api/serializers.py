from rest_framework import serializers
from api.models import *
from django.db import models


class OwnerSerializer(serializers.ModelSerializer):
    key = serializers.ModelField(model_field=Owners()._meta.get_field('owner_id'))
    value = serializers.ModelField(model_field=Owners()._meta.get_field('owner_id'))
    content = serializers.ModelField(model_field=Owners()._meta.get_field('username'))
    serial_type = models.CharField(default='owners')

    class Meta:
        model = Owners
        # fields = ['owner_id', 'first_name', 'last_name', 'username']
        fields = ['key', 'value', 'content', 'owner_id', 'username']


class ExperimentSerializer(serializers.ModelSerializer):
    key = serializers.ModelField(model_field=Experiments()._meta.get_field('experiment_id'))
    value = serializers.ModelField(model_field=Experiments()._meta.get_field('experiment_id'))
    content = serializers.ModelField(model_field=Experiments()._meta.get_field('experiment_name'))
    serial_type = models.CharField(default='experiments')

    class Meta:
        model = Experiments
        fields = ['key', 'value', 'content', 'experiment_id', 'experiment_name', 'create_date']

class CycleTimeSerializer(serializers.BaseSerializer):
    def to_representation(self, instance):
        instance['key'] = instance['begin_cycle_time']
        instance['value'] = instance['begin_cycle_time']
        instance['content'] = instance['begin_cycle_time']
        return instance

class ReaderSerializer(serializers.ModelSerializer):
    key = serializers.ModelField(model_field=Readers()._meta.get_field('reader_id'))
    value = serializers.ModelField(model_field=Readers()._meta.get_field('reader_id'))
    content = serializers.ModelField(model_field=Readers()._meta.get_field('reader_name'))
    serial_type = models.CharField(default='readers')

    class Meta:
        model = Readers
        fields = ['key', 'value', 'content', 'reader_id', 'reader_name']


class ObservationSerializer(serializers.ModelSerializer):
    key = serializers.ModelField(model_field=Observations()._meta.get_field('observation_id'))
    value = serializers.ModelField(model_field=Observations()._meta.get_field('observation_id'))
    content = serializers.ModelField(model_field=Observations()._meta.get_field('observation_name'))
    serial_type = models.CharField(default='observations')

    class Meta:
        model = Observations
        fields = ['key', 'value', 'content', 'observation_id', 'observation_name']


class VariableSerializer(serializers.ModelSerializer):
    key = serializers.ModelField(model_field=Variables()._meta.get_field('variable_id'))
    value = serializers.ModelField(model_field=Variables()._meta.get_field('variable_id'))
    content = serializers.ModelField(model_field=Variables()._meta.get_field('variable_name'))
    serial_type = models.CharField(default='variables')

    class Meta:
        model = Variables
        fields = ['key', 'value', 'content', 'variable_id', 'variable_name', 'channel']


class GroupSerializer(serializers.ModelSerializer):
    key = serializers.ModelField(model_field=Groups()._meta.get_field('group_id'))
    value = serializers.ModelField(model_field=Groups()._meta.get_field('group_id'))
    content = serializers.ModelField(model_field=Groups()._meta.get_field('group_name'))
    serial_type = models.CharField(default='groups')

    class Meta:
        model = Groups
        fields = ['key', 'value', 'content', 'group_id', 'group_name']


class PlotTypeSerializer(serializers.BaseSerializer):
    def to_representation(self, instance):
        instance['key'] = instance['plot_type']
        instance['value'] = instance['plot_type']
        instance['content'] = instance['plot_type']
        return instance


class PlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plots
        fields = ['plot_id', 'div', 'script']
