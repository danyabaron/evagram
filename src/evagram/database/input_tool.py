import pickle
import json
import os
import sys
import argparse
from pathlib import Path
import psycopg2
from dotenv import load_dotenv

load_dotenv()

# environment variables for connecting to database
db_host = os.environ.get('DB_HOST')
db_port = os.environ.get('DB_PORT')
db_name = os.environ.get('DB_NAME')
db_user = os.environ.get('DB_USER')
db_password = os.environ.get('DB_PASSWORD')

# default path configurations
EXPERIMENT_DATA_PATH = './tests/eva'
DATASET_PATH = './src/evagram/database/'
PROCEDURES_PATH = './src/evagram/database/sql'


def main(args):
    global EXPERIMENT_DATA_PATH
    parser = argparse.ArgumentParser()
    parser.add_argument("experiment_path")
    args = parser.parse_args(args)
    experiment_path = Path(args.experiment_path)
    if experiment_path.exists():
        EXPERIMENT_DATA_PATH = args.experiment_path

    conn = psycopg2.connect(
        host=db_host,
        port=db_port,
        dbname=db_name,
        user=db_user,
        password=db_password
    )
    cur = conn.cursor()

    create_procedures(cur)
    drop_tables(cur)
    create_tables(cur)
    load_dataset_to_db(cur)

    conn.commit()
    cur.close()
    conn.close()


def create_procedures(cur):
    for proc in os.listdir(PROCEDURES_PATH):
        proc_file = os.path.join(PROCEDURES_PATH, proc)
        if os.path.isfile(proc_file) and proc.startswith("proc_") and proc.endswith(".sql"):
            contents = open(proc_file, 'r')
            cur.execute(contents.read())
            contents.close()


def create_tables(cur):
    # Users table
    cur.execute("CALL public.create_owners();")
    # Experiments table
    cur.execute("CALL public.create_experiments();")
    # Groups table
    cur.execute("CALL public.create_groups();")
    # Variables table
    cur.execute("CALL public.create_variables();")
    # Observations table
    cur.execute("CALL public.create_observations();")
    # Plots table
    cur.execute("CALL public.create_plots();")


def drop_tables(cur):
    cur.execute("DROP TABLE IF EXISTS owners CASCADE")
    cur.execute("DROP TABLE IF EXISTS experiments CASCADE")
    cur.execute("DROP TABLE IF EXISTS plots CASCADE")
    cur.execute("DROP TABLE IF EXISTS groups CASCADE")
    cur.execute("DROP TABLE IF EXISTS observations CASCADE")
    cur.execute("DROP TABLE IF EXISTS variables CASCADE")


def load_dataset_to_db(cur):
    with open(os.path.join(DATASET_PATH, "dataset.json"), 'rb') as dataset:
        sample_dataset = json.load(dataset)
    for owner in sample_dataset['owners']:
        add_user(cur, owner)
    for experiment in sample_dataset['experiments']:
        add_experiment(cur, experiment)
    for plot in (sample_dataset['plots']):
        add_plot(cur, plot, sample_dataset['observation_dirs'])


def get_observation_name(obs_dirs, filename):
    # TODO: resolve duplicate filenames from different observations
    for observation in obs_dirs:
        obs_dir_path = os.path.join(EXPERIMENT_DATA_PATH, observation)
        for plot in os.listdir(obs_dir_path):
            if filename == plot:
                return observation
    return None


def insert_table_record(cur, data, table):
    cur.execute("SELECT * FROM {} LIMIT 0".format(table))
    colnames = [desc[0] for desc in cur.description]
    # filter data to contain only existing columns in table
    data = {k: v for (k, v) in data.items() if k in colnames}

    query = "INSERT INTO {} (".format(table)
    query += ', '.join(data)
    query += ") VALUES ("
    query += ', '.join(["%s" for _ in range(len(data))])
    query += ")"

    cur.execute(query, tuple(data.values()))


def add_user(cur, user_obj):
    # check not null constraints
    # TODO: owner_id made optional for user to provide
    required = {'owner_id', 'username'}
    difference = required.difference(user_obj)
    if len(difference) > 0:
        print("Missing required columns for owners table: {}".format(difference))
        return 1
    else:
        insert_table_record(cur, user_obj, "owners")
    return 0


def delete_user(cur, username):
    cur.execute("DELETE FROM owners WHERE username=%s", (username,))


def add_experiment(cur, experiment_obj):
    # check not null constraints
    # TODO: experiment_id made optional for user to provide
    required = {'experiment_id', 'owner_id'}
    difference = required.difference(experiment_obj)
    if len(difference) > 0:
        print("Missing required columns for experiment table: {}".format(difference))
        return 1
    else:
        insert_table_record(cur, experiment_obj, "experiments")
    return 0


def add_plot(cur, plot_obj, observation_dirs):
    # check not null constraints
    # TODO: plot_id made optional for user to provide
    required = {'plot_id', 'plot_file', 'experiment_id'}
    difference = required.difference(plot_obj)
    if len(difference) > 0:
        print("Missing required columns for plots table: {}".format(difference))
        return 1

    plot_filename = plot_obj['plot_file']
    observation_name = get_observation_name(observation_dirs, plot_filename)
    plot_file_path = os.path.join(
        EXPERIMENT_DATA_PATH, observation_name, plot_filename)

    with open(plot_file_path, 'rb') as file:
        dictionary = pickle.load(file)

    # extract the div and script components
    div = dictionary['div']
    script = dictionary['script']

    # parse filename for components variable name, channel, and group name
    filename_no_extension = os.path.splitext(plot_filename)[0]
    plot_components = filename_no_extension.split("_")

    var_name = plot_components[0]
    channel = plot_components[1] if plot_components[1] != '' else None
    group_name = plot_components[2]

    # insert observation, variable, group dynamically if not exist in database
    cur.execute("SELECT observation_id FROM observations WHERE observation_name=%s",
                (observation_name,))
    new_observation = len(cur.fetchall()) == 0
    cur.execute(
        """SELECT variable_id FROM variables WHERE variable_name=%s
        AND (channel=%s OR channel IS NULL)""",
        (var_name, channel))
    new_variable = len(cur.fetchall()) == 0
    cur.execute("SELECT group_id FROM groups WHERE group_name=%s", (group_name,))
    new_group = len(cur.fetchall()) == 0

    if new_observation:
        observation_obj = {
            "observation_name": observation_name,
        }
        insert_table_record(cur, observation_obj, "observations")

    if new_variable:
        variable_obj = {
            "variable_name": var_name,
            "channel": channel
        }
        insert_table_record(cur, variable_obj, "variables")

    if new_group:
        group_obj = {
            "group_name": group_name
        }
        insert_table_record(cur, group_obj, "groups")

    # get the observation, variable, group ids
    cur.execute("SELECT observation_id FROM observations WHERE observation_name=%s",
                (observation_name,))
    observation_id = cur.fetchone()[0]
    cur.execute(
        """SELECT variable_id FROM variables WHERE variable_name=%s
        AND (channel=%s OR channel IS NULL)""",
        (var_name, channel))
    variable_id = cur.fetchone()[0]
    cur.execute("SELECT group_id FROM groups WHERE group_name=%s", (group_name,))
    group_id = cur.fetchone()[0]

    # modify plot object
    plot_obj["div"] = div
    plot_obj["script"] = script
    plot_obj["observation_id"] = observation_id
    plot_obj["group_id"] = group_id
    plot_obj["variable_id"] = variable_id

    # insert plot to database
    insert_table_record(cur, plot_obj, "plots")

    return 0


if __name__ == "__main__":
    main(sys.argv[1:])
