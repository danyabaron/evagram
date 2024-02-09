-- PROCEDURE: public.create_variable_group()

-- DROP PROCEDURE IF EXISTS public.create_variable_group();

CREATE OR REPLACE PROCEDURE public.create_variable_group(
	)
LANGUAGE 'sql'
AS $BODY$
CREATE TABLE IF NOT EXISTS variable_group
(
    variable_group_id serial PRIMARY KEY,
    variable_id INT NOT NULL,
    group_id INT NOT NULL,
    CONSTRAINT fk_group FOREIGN KEY (group_id)
        REFERENCES groups (group_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_variable FOREIGN KEY (variable_id)
        REFERENCES variables (variable_id)
        ON DELETE CASCADE,
	UNIQUE (variable_id, group_id)
)
$BODY$;
ALTER PROCEDURE public.create_variable_group()
    OWNER TO postgres;
