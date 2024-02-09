from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from api.models import Experiments, Owners, Observations, Groups, Plots
from api.serializers import *

@api_view(['GET'])
def initial_load(request):
    data = {
        "owners": [],
        "experiments": [],
        "groups": [],
        "observations": [],
        "variables": []
    }
    data["owners"] = get_owners()
    if len(data["owners"]) > 0:
        data["experiments"] = get_experiments_by_owner(data["owners"][0]["owner_id"])
    if len(data["experiments"]) > 0:
        data["observations"] = get_observations_by_experiment(data["experiments"][0]["experiment_id"])
    if len(data["observations"]) > 0:
        data["variables"] = get_variables_by_observation(data["observations"][0]["observation_id"])
    if len(data["variables"]) > 0:
        data["groups"] = get_groups_by_variable(data["variables"][0]["variable_id"])
    return Response(data)

@api_view(['GET'])
def get_plot_components(request):
    experiment_id = request.GET["experiment_id"]
    group_id = request.GET["group_id"]
    observation_id = request.GET["observation_id"]
    variable_id = request.GET["variable_id"]

    plot = Plots.objects.get(experiment=experiment_id,
                         group=group_id,
                         observation=observation_id,
                         variable=variable_id)
    serializer = PlotSerializer(plot)
    return Response(serializer.data)

@api_view(['GET'])
def update_user_option(request):
    owner_id = request.GET["owner_id"]
    data = {
        "experiments": [],
        "observations": [],
        "variables": [],
        "groups": []
    }
    data["experiments"] = get_experiments_by_owner(owner_id)
    if len(data["experiments"]) > 0:
        data["observations"] = get_observations_by_experiment(data["experiments"][0]["experiment_id"])
    if len(data["observations"]) > 0:
        data["variables"] = get_variables_by_observation(data["observations"][0]["observation_id"])
    if len(data["variables"]) > 0:
        data["groups"] = get_groups_by_variable(data["variables"][0]["variable_id"])
    return Response(data)

@api_view(['GET'])
def update_experiment_option(request):
    experiment_id = request.GET["experiment_id"]
    data = {
        "observations": [],
        "variables": [],
        "groups": []
    }
    data["observations"] = get_observations_by_experiment(experiment_id)
    if len(data["observations"]) > 0:
        data["variables"] = get_variables_by_observation(data["observations"][0]["observation_id"])
    if len(data["variables"]) > 0:
        data["groups"] = get_groups_by_variable(data["variables"][0]["variable_id"])
    return Response(data)

@api_view(['GET'])
def update_observation_option(request):
    observation_id = request.GET["observation_id"]
    data = {
        "variables": [],
        "groups": []
    }
    data["variables"] = get_variables_by_observation(observation_id)
    if len(data["variables"]) > 0:
        data["groups"] = get_groups_by_variable(data["variables"][0]["variable_id"])
    return Response(data)

@api_view(['GET'])
def update_variable_option(request):
    variable_id = request.GET["variable_id"]
    data = {
        "groups": []
    }
    data["groups"] = get_groups_by_variable(variable_id)
    return Response(data)

def get_owners():
    queryset = Owners.objects.all()
    serializer = OwnerSerializer(queryset, many=True)
    return serializer.data

def get_experiments_by_owner(pk_owner):
    queryset = Experiments.objects.filter(owner_id=pk_owner)
    serializer = ExperimentSerializer(queryset, many=True)
    return serializer.data

def get_observations_by_experiment(pk_experiment):
    queryset = Observations.objects.filter(plots__experiment_id=pk_experiment).distinct()
    serializer = ObservationSerializer(queryset, many=True)
    return serializer.data

def get_variables_by_observation(pk_observation):
    queryset = Plots.objects.filter(observation_id=pk_observation).values_list("variable_id")
    variables = Variables.objects.filter(variable_id__in=queryset)
    serializer = VariableSerializer(variables, many=True)
    return serializer.data

def get_groups_by_variable(pk_variable):
    queryset = Plots.objects.filter(variable_id=pk_variable).values_list("group_id")
    groups = Groups.objects.filter(group_id__in=queryset)
    serializer = GroupSerializer(groups, many=True)
    return serializer.data
