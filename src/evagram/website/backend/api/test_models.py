from django.test import TestCase
from api.models import *


class TestModels(TestCase):

    def setUp(self):
        # Create an owner
        self.owner = Owners.objects.create(first_name="John", last_name="Doe", username="johndoe")
        # Create an experiment
        self.experiment = Experiments.objects.create(
            experiment_name="test_experiment",
            owner=self.owner
        )
        # Get existing reader
        self.reader = Readers.objects.get(reader_name="ioda_obs_space")
        # Create an observation
        self.observation = Observations.objects.create(observation_name="amsua_n19")
        # Create a variable
        self.variable = Variables.objects.create(variable_name="brightnessTemperature", channel=1)
        # Create a group
        self.group = Groups.objects.create(group_name="gsi_hofx_vs_jedi_hofx")
    
    def test_plot_creation(self):
        """Test that a plot can be created successfully."""
        plot = Plots.objects.create(
            plot_type=PlotType.SCATTER,
            begin_cycle_time=timezone.now(),
            experiment=self.experiment,
            reader=self.reader,
            observation=self.observation,
            variable=self.variable,
            group=self.group
        )
        plot_count = Plots.objects.count()
        self.assertEqual(plot_count, 1)
        self.assertEqual(plot.plot_type, PlotType.SCATTER)
    
    def test_experiment_unique_together_constraint(self):
        """Test the unique together constraint for Experiments."""
        with self.assertRaises(Exception):
            Experiments.objects.create(experiment_name="test_experiment", owner=self.owner)
    
    def test_variable_unique_together_constraint(self):
        """Test the unique together constraint for Variables."""
        with self.assertRaises(Exception):
            Variables.objects.create(variable_name="brightnessTemperature", channel=1)

    def test_plot_unique_together_constraint(self):
        """Test the unique together constraint for Plots."""
        Plots.objects.create(
            plot_type=PlotType.SCATTER,
            begin_cycle_time=timezone.now(),
            experiment=self.experiment,
            reader=self.reader,
            observation=self.observation,
            variable=self.variable,
            group=self.group
        )
        with self.assertRaises(Exception):
            Plots.objects.create(
                plot_type=PlotType.LINE,
                begin_cycle_time=timezone.now(),
                experiment=self.experiment,
                reader=self.reader,
                observation=self.observation,
                variable=self.variable,
                group=self.group
            )

    def test_plot_type_constraint(self):
        """Test that invalid plot types are not allowed."""
        with self.assertRaises(Exception):
            Plots.objects.create(
                plot_type="invalid_type",
                begin_cycle_time=timezone.now(),
                experiment=self.experiment,
                reader=self.reader,
                observation=self.observation,
                variable=self.variable,
                group=self.group
            )