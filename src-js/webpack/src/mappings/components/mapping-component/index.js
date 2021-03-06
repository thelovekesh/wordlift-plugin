/**
 * MappingComponent : it displays the entire mapping screen
 *
 * @author Naveen Muthusamy <naveen@wordlift.io>
 * @since 3.25.0
 */

/**
 * External dependencies
 */
import React from "react";

/**
 * Internal dependencies
 */
import { MAPPINGS_REQUEST_ACTION } from "../../actions/actions";
import { connect } from "react-redux";
import { MappingTable } from "./mapping-table";
import { MappingCategories } from "./mapping-categories";
import { MappingBulkAction } from "./mapping-bulk-action";
import { AddNewButton } from "./add-new-button";

class MappingComponent extends React.Component {
  componentDidMount() {
    this.getMappingItems();
  }

  /**
   * Fetch the mapping items from api.
   * @return void
   */
  getMappingItems() {
    this.props.dispatch(MAPPINGS_REQUEST_ACTION);
  }

  render() {
    return (
      <React.Fragment>
        <AddNewButton />
        <MappingCategories />
        <MappingTable />
        <MappingBulkAction />
      </React.Fragment>
    );
  }
}

export default connect()(MappingComponent);
