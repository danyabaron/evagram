from django.urls import path
from . import views

urlpatterns = [
    path("initial-load/", views.initial_load),
    path("get-plot-components/", views.get_plot_components),
    path("update-user-option/", views.update_user_option),
    path("update-experiment-option/", views.update_experiment_option),
    path("update-observation-option/", views.update_observation_option),
    path("update-variable-option/", views.update_variable_option),
]
