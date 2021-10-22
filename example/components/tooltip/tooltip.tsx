import { Tooltip as MaterialTooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { connect } from "react-redux";

import { TooltipProps } from "./tooltip.types";

const Tooltip: React.FC<TooltipProps> = ({ title }) => {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const listener = (e: MouseEvent) => {
      const coords = { x: 0, y: 0 };

      // Adapted from https://stackoverflow.com/questions/7790725/javascript-track-mouse-position
      e = e || window.event; // IE-ism

      if (e.pageX == null && e.clientX != null) {
        const target = (e.target && (e.target as EventTarget & { ownerDocument: Document }).ownerDocument) || document;
        const doc = target.documentElement;
        const body = target.body;

        coords.x = e.clientX +
          (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
          (doc && doc.clientLeft || body && body.clientLeft || 0);
        coords.y = e.clientY +
          (doc && doc.scrollTop || body && body.scrollTop || 0) -
          (doc && doc.clientTop || body && body.clientTop || 0);
      }

      // Set local state
      setCoords({
        x: coords.x || e.pageX,
        y: coords.y || e.pageY
      });

      setOpen(true);
    };

    window.addEventListener("mousemove", listener);

    return () => {
      window.removeEventListener("mousemove", listener);
    }
  }, []);

  // Use CSS to adjust the position to the cursor
  const getStyle = (): object => {
    const top = coords.y + 'px';
    const left = coords.x + 'px';

    return {
      transform: `translate3d(${left}, ${top}, 0)`
    }
  }

  // Wrapped in a div to avoid https://stackoverflow.com/a/59845764
  return <div>
    {title && <MaterialTooltip title={title} open={open} placement="top">
      <section style={getStyle()} id="overlay"></section>
    </MaterialTooltip>}
  </div>
}

export default connect((state: { tooltip?: string }) => {
  return { title: state.tooltip }
})(Tooltip);