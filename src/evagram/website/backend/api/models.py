from django.db import models


class Owners(models.Model):
    owner_id = models.AutoField(primary_key=True)
    first_name = models.CharField(null=True)
    last_name = models.CharField(null=True)
    username = models.CharField(null=False, unique=True, default="null")

    class Meta:
        db_table = 'owners'


class Experiments(models.Model):
    experiment_id = models.AutoField(primary_key=True)
    experiment_name = models.CharField(null=False, default="null")
    create_date = models.DateTimeField(auto_now_add=True)
    owner = models.ForeignKey('Owners', models.CASCADE)

    class Meta:
        db_table = 'experiments'
        unique_together = (('experiment_name', 'owner'),)


class Readers(models.Model):
    reader_id = models.AutoField(primary_key=True)
    reader_name = models.CharField(null=False, unique=True)

    class Meta:
        db_table = 'readers'


class Observations(models.Model):
    observation_id = models.AutoField(primary_key=True)
    observation_name = models.CharField(null=False, unique=True, default="null")

    class Meta:
        db_table = 'observations'


class Variables(models.Model):
    variable_id = models.AutoField(primary_key=True)
    variable_name = models.CharField(null=False, default="null")
    channel = models.IntegerField(blank=True, null=True)

    class Meta:
        db_table = 'variables'
        unique_together = (('variable_name', 'channel'),)


class Groups(models.Model):
    group_id = models.AutoField(primary_key=True)
    group_name = models.CharField(unique=True, null=False, default="null")

    class Meta:
        db_table = 'groups'


class Plots(models.Model):
    class PlotType(models.TextChoices):
        SCATTER = ("SC", "Scatter")
        MAP_SCATTER = ("MS", "Map Scatter")
        MAP_GRIDDED = ("MG", "Map Gridded")
        DENSITY = ("DN", "Density")
        HISTOGRAM = ("HG", "Histogram")
        LINE = ("LN", "Line")

    plot_id = models.AutoField(primary_key=True)
    plot_type = models.CharField(max_length=2, choices=PlotType.choices, default=PlotType.SCATTER)
    div = models.CharField(blank=True, null=True)
    script = models.CharField(blank=True, null=True)
    begin_cycle_time = models.DateTimeField(null=False)
    end_cycle_time = models.DateTimeField(null=True)
    experiment = models.ForeignKey(Experiments, models.CASCADE)
    reader = models.ForeignKey(Readers, models.CASCADE)
    observation = models.ForeignKey(Observations, models.CASCADE)
    variable = models.ForeignKey(Variables, models.CASCADE)
    group = models.ForeignKey(Groups, models.CASCADE)

    class Meta:
        db_table = 'plots'
        unique_together = (('experiment', 'reader', 'observation', 'variable', 'group'),)


class Aliases(models.Model):
    alias_id = models.AutoField(primary_key=True)
    alias_name = models.CharField(null=False)
    alias_value = models.CharField(null=False)
    reader = models.ForeignKey(Readers, models.CASCADE)

    class Meta:
        db_table = 'aliases'
