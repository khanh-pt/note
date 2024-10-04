import React from "react";

export default function CustomTypography({ children, variant, className }) {
  return React.createElement(variant, { className }, children);
}
