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
        self.begin_cycle_time = timezone.now()
        self.reader = Readers.objects.get(reader_name="ioda_obs_space")
        self.observation = Observations.objects.create(observation_name="amsua_n19")
        self.variable = Variables.objects.create(variable_name="brightnessTemperature", channel=1)
        self.group = Groups.objects.create(group_name="gsi_hofx_vs_jedi_hofx")
        self.plot = Plots.objects.create(
            plot_type='scatter',
            begin_cycle_time=self.begin_cycle_time,
            experiment=self.experiment,
            reader=self.reader,
            observation=self.observation,
            variable=self.variable,
            group=self.group
        )

    def test_initial_load(self):
        """
        Test the 'initial_load' view, which is responsible for the initial load
        of the page, ensuring that it returns the expected owners and experiments.

        The test simulates a GET request to the 'initial_load' view and
        verifies that:
        - The response status is 200 OK.
        - The response data contains the expected 'owners' and 'experiments' keys.
        - The 'owners' list is not empty, ensuring that owners were retrieved.
        - The 'experiments' list is not empty, ensuring that experiments associated
          with the first owner were retrieved.

        This test ensures that the initial data needed for rendering the page
        is correctly provided by the API.
        """
        response = self.client.get("/api/initial-load/")
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertIn('owners', response.data)
        self.assertIn('experiments', response.data)
        self.assertGreater(len(response.data['owners']), 0)
        self.assertGreater(len(response.data['experiments']), 0)

    def test_get_plots_by_field_valid(self):
        """
        Test the 'get_plots_by_field' view to ensure that it returns the correct
        plot data based on various input parameters.

        The test simulates a GET request to the 'get_plots_by_field' view with specific
        query parameters and verifies that:
        - The response status is 200 OK when valid parameters are provided.
        - The response data contains the expected plot information.
        - Missing or incorrect parameters result in appropriate error messages and
          status codes (e.g., 400 Bad Request, 404 Not Found).

        This test ensures that the view handles various scenarios, such as filtering
        by owner, experiment, cycle time, reader, observation, variable, group, and plot type.
        """
        response = self.client.get('/api/get-plots-by-field/', {
            'owner_id': self.owner.owner_id,
            'experiment_id': self.experiment.experiment_id,
            'cycle_time': self.begin_cycle_time,
            'reader_id': self.reader.reader_id,
            'observation_id': self.observation.observation_id,
            'variable_name': self.variable.variable_name,
            'channel': self.variable.channel,
            'group_id': self.group.group_id,
            'plot_type': 'scatter'
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
            'cycle_time': self.begin_cycle_time,
            'reader_id': self.reader.reader_id,
            'observation_id': self.observation.observation_id,
            'variable_name': self.variable.variable_name,
            'channel': self.variable.channel,
            'group_id': self.group.group_id,
            'plot_type': 'scatter'
        })
        self.assertEqual(status.HTTP_400_BAD_REQUEST, response.status_code)
        self.assertIn("error", response.data)

    def test_get_plots_by_field_missing_param(self):
        """
        The test simulates a GET request to the 'get_plots_by_field' view with
        various combinations of parameters to ensure:
        - The response status is 200 OK when valid parameters are provided.
        - The response contains the correct plot data based on the selected parameters.
        - Appropriate error messages and status codes are returned for missing
        or invalid parameters.

        This test ensures that the cascading selection logic is correctly enforced,
        and that the view behaves as expected for different parameter configurations.
        """
        response = self.client.get('/api/get-plots-by-field/', {
            'experiment_id': self.experiment.experiment_id,
            'observation_id': self.observation.observation_id,
            'cycle_time': self.begin_cycle_time,
            'reader_id': self.reader.reader_id,
            'variable_name': self.variable.variable_name,
            'channel': self.variable.channel,
            'group_id': self.group.group_id,
            'plot_type': 'scatter'
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
        self.assertIn('cycle_times', response.data)

    def test_update_cycle_time_option(self):
        """Test the update_cycle_time_option view returns correct data."""
        response = self.client.get('/api/update-cycle-time-option/', {
            'experiment_id': self.experiment.experiment_id,
            'cycle_time': self.begin_cycle_time})
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertIn('readers', response.data)

    def test_update_reader_option(self):
        """Test the update_cycle_reader_option view returns correct data."""
        response = self.client.get('/api/update-reader-option/', {
            'experiment_id': self.experiment.experiment_id,
            'cycle_time': self.begin_cycle_time,
            'reader_id': self.reader.reader_id})
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertIn('observations', response.data)

    def test_update_observation_option(self):
        """Test the update_observation_option view returns correct data."""
        response = self.client.get('/api/update-observation-option/', {
            'experiment_id': self.experiment.experiment_id,
            'cycle_time': self.begin_cycle_time,
            'reader_id': self.reader.reader_id,
            'observation_id': self.observation.observation_id})
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertIn('variables', response.data)
        self.assertIn('variablesMap', response.data)

    def test_update_variable_option(self):
        """Test the update_variable_option view returns correct data."""
        response = self.client.get('/api/update-variable-option/', {
            'experiment_id': self.experiment.experiment_id,
            'cycle_time': self.begin_cycle_time,
            'reader_id': self.reader.reader_id,
            'observation_id': self.observation.observation_id,
            'variable_name': self.variable.variable_name,
            'channel': self.variable.channel
        })
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertIn('groups', response.data)
        self.assertIn('channel', response.data)

    def test_update_group_option(self):
        """Test the update_group_option view returns correct data."""
        response = self.client.get('/api/update-group-option/', {
            'experiment_id': self.experiment.experiment_id,
            'cycle_time': self.begin_cycle_time,
            'reader_id': self.reader.reader_id,
            'observation_id': self.observation.observation_id,
            'variable_name': self.variable.variable_name,
            'channel': self.variable.channel,
            'group_id': self.group.group_id
        })
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertIn('plot_types', response.data)

    def test_get_reader_aliases(self):
        """
        Test the 'get_reader_aliases' view to ensure that it returns
        correct alias mappings for the specified reader.

        The test creates a reader and an associated alias, then makes a
        GET request to the view with the reader's ID. The response is
        checked to confirm that it includes the correct alias names for
        observation, variable, and group.

        The expected keys in the response are:
        - 'observation_name': Should match the alias name for observations.
        - 'variable_name': Should match the alias name for variables.
        - 'group_name': Should match the alias name for groups.
        """
        response = self.client.get('/api/get-reader-aliases/', {'reader_id': self.reader.reader_id})
        self.assertEqual(status.HTTP_200_OK, response.status_code)
        self.assertIn('observation_name', response.data)
        self.assertIn('variable_name', response.data)
        self.assertIn('group_name', response.data)
