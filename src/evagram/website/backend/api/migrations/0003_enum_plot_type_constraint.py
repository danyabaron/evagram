# Generated by Django 4.2.10 on 2024-07-29 14:09

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_populate_readers_and_aliases'),
    ]

    operations = [
        migrations.AlterField(
            model_name='experiments',
            name='create_date',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
        migrations.AlterField(
            model_name='experiments',
            name='owner',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='api.owners'),
        ),
        migrations.AlterField(
            model_name='plots',
            name='plot_type',
            field=models.CharField(choices=[('scatter', 'Scatter Plot'), ('map_scatter', 'Map Scatter Plot'), ('map_gridded', 'Map Gridded'), ('density', 'Density Graph'), ('histogram', 'Histogram'), ('line', 'Line Graph')], null=True),
        ),
        migrations.AddConstraint(
            model_name='plots',
            constraint=models.CheckConstraint(check=models.Q(('plot_type__in', ['scatter', 'map_scatter', 'map_gridded', 'density', 'histogram', 'line'])), name='valid_plot_type'),
        ),
    ]
