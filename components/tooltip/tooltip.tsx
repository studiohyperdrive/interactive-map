import { Tooltip as MaterialTooltip } from "@mui/material";
import { connect } from "react-redux";

import { TooltipProps } from "./tooltip.types";

const Tooltip: React.FC<TooltipProps> = (props) => {
  return props.title ? (
    <MaterialTooltip title={props.title} followCursor>
      <section id="overlay"></section>
    </MaterialTooltip>
  ): null
}

export default connect((state: {tooltip?: string}) => {
  return {title: state.tooltip}
})(Tooltip);