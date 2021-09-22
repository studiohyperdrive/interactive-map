import { Tooltip as MaterialTooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { connect } from "react-redux";

import { TooltipProps } from "./tooltip.types";

import { debounce } from "../../webgl/assets/utils/eventHelpers";

const Tooltip: React.FC<TooltipProps> = ({ title }) => {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const listener = debounce((e: MouseEvent) => {
      const coords = {x: 0, y: 0};

      // Adapted from https://stackoverflow.com/questions/7790725/javascript-track-mouse-position
      let ed, doc, body;

      e = e || window.event; // IE-ism

      if (e.pageX == null && e.clientX != null) {
        ed = (e.target && (e.target as EventTarget & {ownerDocument: Document}).ownerDocument) || document;
        doc = ed.documentElement;
        body = ed.body;

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
    }, 8);

    document.addEventListener("mousemove", listener);

    return () => {
      document.removeEventListener("mousemove", listener);
    }
  }, []);

  const getStyle = (): object => {
    const top = coords.y + 1 + 'px'; // avoid click capturing
    const left = coords.x + 'px';

    return {
      transform: `translate3d(${left}, ${top}, 0)`
    }
  }

  return (
    title ? <MaterialTooltip title={title} open={open} placement="top">
      <section style={getStyle()} id="overlay"></section>
    </MaterialTooltip> : null
  );
}

export default connect((state: { tooltip?: string }) => {
  return { title: state.tooltip }
})(Tooltip);