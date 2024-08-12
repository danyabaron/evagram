from django.test import TestCase
from api.models import *
from api.serializers import PlotSerializer
from rest_framework import status


class TestAPIView(TestCase):

    def setUp(self):
        # Set up initial data for testing
        self.owner = Owners.objects.create(first_name="John", last_name="Doe", username="johndoe")
        self.experiment = Experiments.objects.create(
            experiment_name="test_experiment",
            owner=self.owner
        )
        self.reader = Readers.objects.get(reader_name="ioda_obs_space")
        self.observation = Observations.objects.create(observation_name="amsua_n19")
        self.variable = Variables.objects.create(variable_name="brightnessTemperature", channel=1)
        self.group = Groups.objects.create(group_name="gsi_hofx_vs_jedi_hofx")
        self.plot = Plots.objects.create(
            plot_type='scatter',
            begin_cycle_time=timezone.now(),
            experiment=self.experiment,
            reader=self.reader,
            observation=self.observation,
            variable=self.variable,
            group=self.group
        )

    def test_initial_load(self):
        response = self.client.get("/api/initial-load/")
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertIn("owners", response.data)

    def test_get_plots_by_field_valid(self):
        """Test the get_plots_by_field view returns plots for valid inputs."""
        response = self.client.get('/api/get-plots-by-field/', {
            'owner_id': self.owner.owner_id,
            'experiment_id': self.experiment.experiment_id,
            'observation_id': self.observation.observation_id,
            'variable_name': self.variable.variable_name,
            'channel': self.variable.channel,
            'group_id': self.group.group_id
        })
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        expected_plots = PlotSerializer(
            Plots.objects.filter(experiment=self.experiment), many=True).data
        self.assertEqual(expected_plots, response.data)

    def test_get_plots_by_field_invalid_owner(self):
        """Test get_plots_by_field with invalid owner_id."""
        response = self.client.get('/api/get-plots-by-field/', {
            'owner_id': 'null',
            'experiment_id': self.experiment.experiment_id,
            'observation_id': self.observation.observation_id,
            'variable_name': self.variable.variable_name,
            'channel': self.variable.channel,
            'group_id': self.group.group_id
        })
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)
        self.assertIn("error", response.data)

    def test_get_plots_by_field_missing_param(self):
        """Test get_plots_by_field with a missing parameter."""
        response = self.client.get('/api/get-plots-by-field/', {
            'experiment_id': self.experiment.experiment_id,
            'observation_id': self.observation.observation_id,
            'variable_name': self.variable.variable_name,
            'channel': self.variable.channel,
            'group_id': self.group.group_id
        })
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)
        self.assertIn("error", response.data)

    def test_update_user_option(self):
        """Test the update_user_option view returns correct data."""
        response = self.client.get('/api/update-user-option/', {'owner_id': self.owner.owner_id})
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertIn('experiments', response.data)

    def test_update_user_option_invalid_owner(self):
        """Test update_user_option with an invalid owner_id."""
        response = self.client.get('/api/update-user-option/', {'owner_id': 999})
        self.assertEqual(status.HTTP_404_NOT_FOUND, response.status_code)
        self.assertIn("error", response.data)

    def test_update_experiment_option(self):
        """Test the update_experiment_option view returns correct data."""
        response = self.client.get('/api/update-experiment-option/',
                                   {'experiment_id': self.experiment.experiment_id})
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertIn('observations', response.data)

    def test_update_observation_option(self):
        """Test the update_observation_option view returns correct data."""
        response = self.client.get('/api/update-observation-option/', {
            'experiment_id': self.experiment.experiment_id,
            'observation_id': self.observation.observation_id})
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertIn('variables', response.data)
        self.assertIn('variablesMap', response.data)

    def test_update_variable_option(self):
        """Test the update_variable_option view returns correct data."""
        response = self.client.get('/api/update-variable-option/', {
            'experiment_id': self.experiment.experiment_id,
            'observation_id': self.observation.observation_id,
            'variable_name': self.variable.variable_name,
            'channel': self.variable.channel
        })
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertIn('groups', response.data)
        self.assertIn('channel', response.data)
