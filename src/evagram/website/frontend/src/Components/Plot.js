import { useEffect, useState } from "react";
import axios from "axios";
import * as DOMPurify from "dompurify";

function Plot({ experiment, group, observation, variable }) {
  const [divContents, setDivContents] = useState("");

  useEffect(() => {
    const scriptComponent = document.createElement("script");
    if (
      experiment !== "" &&
      group !== "" &&
      observation !== "" &&
      variable !== ""
    ) {
      axios
        .get("http://localhost:8000/api/get-plot-components", {
          params: {
            experiment_id: experiment,
            group_id: group,
            observation_id: observation,
            variable_id: variable,
          },
        })
        .then((response) => {
          setDivContents(DOMPurify.sanitize(response.data["div"]));
          const scriptContents = DOMPurify.sanitize(
            response.data["script"].replace(/(<([^>]+)>)/gi, "")
          );
          scriptComponent.innerHTML = scriptContents;
          document.body.appendChild(scriptComponent);
        });
      return () => {
        document.body.removeChild(scriptComponent);
      };
    }
  }, [experiment, group, observation, variable]);
  return <div dangerouslySetInnerHTML={{ __html: divContents }} />;
}

export default Plot;
