from django.test import TestCase
from evagram_input import input_data
from api.models import *


class TestEvagramInputTool(TestCase):
    @classmethod
    def setUpTestData(cls):
        input_data(owner="postgres", experiment="experiment1", eva_directory="tests/eva")

    def test_OwnerInSession(self):
        queryset = Owners.objects.filter(username="postgres")
        self.assertEqual(1, len(queryset))

    def test_ExperimentInSession(self):
        owner = Owners.objects.get(username="postgres")
        queryset = Experiments.objects.filter(experiment_name="experiment1", owner=owner)
        self.assertEqual(1, len(queryset))

    def test_WrongRootOwner(self):
        with self.assertRaises(Exception):
            input_data(owner="test", experiment="experiment1", eva_directory="tests/eva")

    def test_ExperimentPathNotFound(self):
        with self.assertRaises(FileNotFoundError):
            input_data(owner="postgres", experiment="experiment1", eva_directory="not/a/path")

    def test_RollbackOnException(self):
        with self.assertRaises(Exception):
            input_data(owner="postgres", experiment="bad_experiment", eva_directory="tests/invalid_reader")

        owner = Owners.objects.get(username="postgres")
        experiments = Experiments.objects.filter(experiment_name="bad_experiment", owner=owner)
        self.assertEqual(0, len(experiments))
    
    def test_InvalidCycleTime(self):
        with self.assertRaises(ValueError):
            input_data(owner="postgres", experiment="invalid_cycle_time", eva_directory="tests/invalid_cycle_time")
    
    def test_InvalidPlotType(self):
        with self.assertRaises(Exception):
            input_data(owner="postgres", experiment="invalid_plot_type", eva_directory="tests/invalid_plot_type")
