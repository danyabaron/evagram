from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from api.models import *
from api.serializers import *
from django.core.exceptions import ObjectDoesNotExist


@api_view(['GET'])
def initial_load(request):
    try:
        data = {
            "owners": [],
            "experiments": []
        }
        data["owners"] = get_owners()
        assert len(data["owners"]) > 0, "Internal issue. No users found."
        data["experiments"] = get_experiments_by_owner(data["owners"][0]["owner_id"])
        return Response(data)

    except AssertionError as e:
        return Response({"error": str(e)}, status=400)


@api_view(['GET'])
def get_plots_by_field(request):
    try:
        owner_id = request.GET["owner_id"]
        experiment_id = request.GET["experiment_id"]
        cycle_time = request.GET["cycle_time"]
        reader_id = request.GET["reader_id"]
        observation_id = request.GET["observation_id"]
        variable_name = request.GET["variable_name"]
        channel = request.GET["channel"]
        group_id = request.GET["group_id"]
        plot_type = request.GET["plot_type"]

        plots = Plots.objects.none()

        # Assertion/Validation Checks
        # ensure owner and experiment are selected
        if owner_id != "null" and experiment_id != "null":
            # verify experiment is part of owner
            experiments = Experiments.objects.filter(owner_id=owner_id)
            current_experiment = Experiments.objects.get(experiment_id=experiment_id)
            error_msg = ("Experiment not found for the specified username. "
                         "Please verify the username and experiment details.")
            assert current_experiment in experiments, error_msg

        # invalid input
        if owner_id == "null":
            serializer = PlotSerializer(plots, many=True)
            return Response(
                {"error": "Please specify a username. The 'null' value is not a valid username."},
                status=400)

        # experiment not selected, query by owner
        elif experiment_id == "null":
            experiments = Experiments.objects.filter(owner_id=owner_id)
            plots = Plots.objects.filter(experiment_id__in=experiments)

        # cycle time not selected, query by experiment
        elif cycle_time == "null":
            plots = Plots.objects.filter(experiment=experiment_id)

        # reader not selected, query by cycle time
        elif reader_id == "null":
            plots = Plots.objects.filter(experiment=experiment_id,
                                         begin_cycle_time=cycle_time)

        # observation not selected, query by reader
        elif observation_id == "null":
            plots = Plots.objects.filter(experiment=experiment_id,
                                         begin_cycle_time=cycle_time,
                                         reader=reader_id)

        # variable not selected, query by observation
        elif variable_name == "null":
            plots = Plots.objects.filter(experiment=experiment_id,
                                         begin_cycle_time=cycle_time,
                                         reader=reader_id,
                                         observation=observation_id)

        # group not selected, query by variable
        elif group_id == "null":
            plots = Plots.objects.filter(experiment=experiment_id,
                                         begin_cycle_time=cycle_time,
                                         reader=reader_id,
                                         observation=observation_id,
                                         variable=get_variable_id(variable_name, channel))

        # plot type not selected, query by group
        elif plot_type == "null":
            plots = Plots.objects.filter(experiment=experiment_id,
                                         begin_cycle_time=cycle_time,
                                         reader=reader_id,
                                         observation=observation_id,
                                         variable=get_variable_id(variable_name, channel),
                                         group_id=group_id)

        # every field is selected
        elif plot_type != "":
            plots = Plots.objects.filter(experiment=experiment_id,
                                         begin_cycle_time=cycle_time,
                                         reader=reader_id,
                                         observation=observation_id,
                                         variable=get_variable_id(variable_name, channel),
                                         group_id=group_id,
                                         plot_type=plot_type)

        serializer = PlotSerializer(plots, many=True)
        return Response(serializer.data)

    except AssertionError as e:
        return Response({"error": str(e)}, status=400)

    except ValueError as e:
        return Response({"error": str(e)}, status=400)

    except KeyError as e:
        error_msg = "Missing request parameter detected: {}".format(str(e))
        return Response({"error": error_msg}, status=400)

    except ObjectDoesNotExist as e:
        return Response({"error": str(e)}, status=404)


@api_view(['GET'])
def update_user_option(request):
    try:
        owner_id = request.GET["owner_id"]
        Owners.objects.get(pk=owner_id)
        data = {
            "experiments": []
        }
        data["experiments"] = get_experiments_by_owner(owner_id)
        return Response(data)

    except ValueError as e:
        return Response({"error": str(e)}, status=400)

    except KeyError as e:
        error_msg = "Missing request parameter detected: {}".format(str(e))
        return Response({"error": error_msg}, status=400)

    except ObjectDoesNotExist as e:
        return Response({"error": str(e)}, status=404)


@api_view(['GET'])
def update_experiment_option(request):
    try:
        experiment_id = request.GET["experiment_id"]
        Experiments.objects.get(pk=experiment_id)
        data = {
            "cycle_times": []
        }
        data["cycle_times"] = get_cycle_times_by_experiment(experiment_id)
        return Response(data)

    except ValueError as e:
        return Response({"error": str(e)}, status=400)

    except KeyError as e:
        error_msg = "Missing request parameter detected: {}".format(str(e))
        return Response({"error": error_msg}, status=400)

    except ObjectDoesNotExist as e:
        return Response({"error": str(e)}, status=404)


@api_view(['GET'])
def update_cycle_time_option(request):
    try:
        experiment_id = request.GET["experiment_id"]
        cycle_time = request.GET["cycle_time"]
        data = {
            "readers": []
        }
        data["readers"] = get_readers_by_cycle_time(experiment_id, cycle_time)
        return Response(data)

    except ValueError as e:
        return Response({"error": str(e)}, status=400)

    except KeyError as e:
        error_msg = "Missing request parameter detected: {}".format(str(e))
        return Response({"error": error_msg}, status=400)

    except ObjectDoesNotExist as e:
        return Response({"error": str(e)}, status=404)


@api_view(['GET'])
def update_reader_option(request):
    try:
        experiment_id = request.GET["experiment_id"]
        cycle_time = request.GET["cycle_time"]
        reader_id = request.GET["reader_id"]
        Readers.objects.get(pk=reader_id)
        data = {
            "observations": []
        }
        data["observations"] = get_observations_by_reader(experiment_id, cycle_time, reader_id)
        return Response(data)

    except ValueError as e:
        return Response({"error": str(e)}, status=400)

    except KeyError as e:
        error_msg = "Missing request parameter detected: {}".format(str(e))
        return Response({"error": error_msg}, status=400)

    except ObjectDoesNotExist as e:
        return Response({"error": str(e)}, status=404)


@api_view(['GET'])
def update_observation_option(request):
    try:
        experiment_id = request.GET["experiment_id"]
        cycle_time = request.GET["cycle_time"]
        reader_id = request.GET["reader_id"]
        observation_id = request.GET["observation_id"]
        Observations.objects.get(pk=observation_id)
        data = {
            "variables": [],
            "variablesMap": {}
        }
        data["variables"] = get_variables_by_observation(experiment_id,
                                                         cycle_time,
                                                         reader_id,
                                                         observation_id)
        variablesMap = {}
        for variable in data["variables"]:
            variablesMap[variable['variable_name']] = variablesMap.get(
                variable['variable_name'], []) + [variable['channel']]
        data["variablesMap"] = variablesMap
        return Response(data)

    except ValueError as e:
        return Response({"error": str(e)}, status=400)

    except KeyError as e:
        error_msg = "Missing request parameter detected: {}".format(str(e))
        return Response({"error": error_msg}, status=400)

    except ObjectDoesNotExist as e:
        return Response({"error": str(e)}, status=404)


@api_view(['GET'])
def update_variable_option(request):
    try:
        experiment_id = request.GET["experiment_id"]
        cycle_time = request.GET["cycle_time"]
        reader_id = request.GET["reader_id"]
        observation_id = request.GET["observation_id"]
        variable_name = request.GET["variable_name"]
        channel = request.GET["channel"]
        variable_id = None

        if channel == "null":
            # check if variable does not include a channel by default,
            # otherwise it has not been configured yet in the PlotMenu
            queryset = Variables.objects.filter(variable_name=variable_name, channel=None)
            if len(queryset) == 1:
                variable_id = queryset[0].variable_id
            # pull the top channel from variable name
            else:
                queryset = Variables.objects.filter(variable_name=variable_name)
                assert len(queryset) > 0
                channel = queryset[0].channel
                variable_id = queryset[0].variable_id
        # get variable id from variable name and channel
        else:
            variable_id = Variables.objects.get(
                variable_name=variable_name, channel=channel).variable_id

        data = {
            "groups": [],
            "channel": channel
        }
        data["groups"] = get_groups_by_variable(experiment_id,
                                                cycle_time,
                                                reader_id,
                                                observation_id,
                                                variable_id)
        return Response(data)

    except AssertionError as e:
        error_msg = ("Unable to locate the given variable name. "
                     "Make sure a channel option is selected if exists.")
        return Response({"error": error_msg}, status=404)

    except ValueError as e:
        return Response({"error": str(e)}, status=400)

    except KeyError as e:
        error_msg = "Missing request parameter detected: {}".format(str(e))
        return Response({"error": error_msg}, status=400)

    except ObjectDoesNotExist as e:
        return Response({"error": str(e)}, status=404)


@api_view(['GET'])
def update_group_option(request):
    try:
        experiment_id = request.GET["experiment_id"]
        cycle_time = request.GET["cycle_time"]
        reader_id = request.GET["reader_id"]
        observation_id = request.GET["observation_id"]
        variable_name = request.GET["variable_name"]
        channel = request.GET["channel"]
        group_id = request.GET["group_id"]
        Groups.objects.get(pk=group_id)

        variable_id = Variables.objects.get(variable_name=variable_name,
                                            channel=None if channel == "null" else channel)

        data = {
            "plot_types": []
        }
        data["plot_types"] = get_plot_types_by_group(experiment_id,
                                                     cycle_time,
                                                     reader_id,
                                                     observation_id,
                                                     variable_id,
                                                     group_id)
        return Response(data)

    except ValueError as e:
        return Response({"error": str(e)}, status=400)

    except KeyError as e:
        error_msg = "Missing request parameter detected: {}".format(str(e))
        return Response({"error": error_msg}, status=400)

    except ObjectDoesNotExist as e:
        return Response({"error": str(e)}, status=404)


@api_view(['GET'])
def get_reader_aliases(request):
    reader_id = request.GET["reader_id"]
    data = {
        "observation_name": Aliases.objects.get(reader_id=reader_id,
                                                alias_name='Observation').alias_value,
        "variable_name": Aliases.objects.get(reader_id=reader_id,
                                             alias_name='Variable').alias_value,
        "group_name": Aliases.objects.get(reader_id=reader_id,
                                          alias_name='Group').alias_value,
    }
    return Response(data)


def get_owners():
    queryset = Owners.objects.all()
    serializer = OwnerSerializer(queryset, many=True)
    return serializer.data


def get_experiments_by_owner(pk_owner):
    queryset = Experiments.objects.filter(owner_id=pk_owner)
    serializer = ExperimentSerializer(queryset, many=True)
    return serializer.data


def get_cycle_times_by_experiment(pk_experiment):
    queryset = Plots.objects.filter(experiment=pk_experiment).values("begin_cycle_time").distinct()
    serializer = CycleTimeSerializer(queryset, many=True)
    return serializer.data


def get_readers_by_cycle_time(pk_experiment, cycle_time):
    queryset = Plots.objects.filter(experiment=pk_experiment,
                                    begin_cycle_time=cycle_time).values_list("reader_id").distinct()
    readers = Readers.objects.filter(reader_id__in=queryset)
    serializer = ReaderSerializer(readers, many=True)
    return serializer.data


def get_observations_by_reader(pk_experiment, cycle_time, pk_reader):
    queryset = Plots.objects.filter(experiment=pk_experiment,
                                    begin_cycle_time=cycle_time,
                                    reader=pk_reader).values_list("observation_id").distinct()
    observations = Observations.objects.filter(observation_id__in=queryset)
    serializer = ObservationSerializer(observations, many=True)
    return serializer.data


def get_variables_by_observation(pk_experiment, cycle_time, pk_reader, pk_observation):
    queryset = Plots.objects.filter(experiment=pk_experiment,
                                    begin_cycle_time=cycle_time,
                                    reader=pk_reader,
                                    observation=pk_observation
                                    ).values_list("variable_id").distinct()
    variables = Variables.objects.filter(variable_id__in=queryset)
    serializer = VariableSerializer(variables, many=True)
    return serializer.data


def get_groups_by_variable(pk_experiment, cycle_time, pk_reader, pk_observation, pk_variable):
    queryset = Plots.objects.filter(experiment=pk_experiment,
                                    begin_cycle_time=cycle_time,
                                    reader=pk_reader,
                                    observation=pk_observation,
                                    variable=pk_variable).values_list("group_id").distinct()
    groups = Groups.objects.filter(group_id__in=queryset)
    serializer = GroupSerializer(groups, many=True)
    return serializer.data


def get_plot_types_by_group(pk_experiment, cycle_time, pk_reader, pk_observation, pk_variable,
                            pk_group):
    queryset = Plots.objects.filter(experiment=pk_experiment,
                                    begin_cycle_time=cycle_time,
                                    reader=pk_reader,
                                    observation=pk_observation,
                                    variable=pk_variable,
                                    group=pk_group).values("plot_type").distinct()
    serializer = PlotTypeSerializer(queryset, many=True)
    return serializer.data


def get_variable_id(variable_name, channel):
    # lookup variable id by variable name and channel
    channel = None if channel == "null" else channel
    variable_id = Variables.objects.get(variable_name=variable_name,
                                        channel=channel).variable_id
    return variable_id
