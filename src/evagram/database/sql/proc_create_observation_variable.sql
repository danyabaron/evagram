-- PROCEDURE: public.create_observation_variable()

-- DROP PROCEDURE IF EXISTS public.create_observation_variable();

CREATE OR REPLACE PROCEDURE public.create_observation_variable(
	)
LANGUAGE 'sql'
AS $BODY$
CREATE TABLE observation_variable (
	observation_variable_id SERIAL PRIMARY KEY,
	observation_id INTEGER NOT NULL,
	variable_id INTEGER NOT NULL,
	CONSTRAINT fk_observation
		FOREIGN KEY (observation_id)
			REFERENCES observations(observation_id)
			ON DELETE CASCADE,
	CONSTRAINT fk_variable
		FOREIGN KEY (variable_id)
			REFERENCES variables(variable_id)
			ON DELETE CASCADE,
	UNIQUE(observation_id, variable_id)
);
$BODY$;
ALTER PROCEDURE public.create_observation_variable()
    OWNER TO postgres;
