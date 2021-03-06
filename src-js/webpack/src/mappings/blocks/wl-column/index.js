/**
 * WlColumn: Shows a column on ui.
 * @author Naveen Muthusamy <naveen@wordlift.io>
 * @since 3.25.0
 */

/**
 * External dependencies.
 */
import React from "react";

/**
 * Internal dependencies.
 */
import "./index.scss";

export const WlColumn = ({ children, className = "" }) => {
  return <div className={"wl-col " + className}>{children}</div>;
};
