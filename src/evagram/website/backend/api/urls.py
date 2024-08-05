from django.urls import path
from . import views

urlpatterns = [
    path("initial-load/", views.initial_load),
    path("get-plots-by-field/", views.get_plots_by_field),
    path("update-user-option/", views.update_user_option),
    path("update-experiment-option/", views.update_experiment_option),
    path("update-cycle-time-option/", views.update_cycle_time_option),
    path("update-reader-option/", views.update_reader_option),
    path("update-observation-option/", views.update_observation_option),
    path("update-variable-option/", views.update_variable_option),
    path("update-group-option/", views.update_group_option),
]
