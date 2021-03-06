/**
 * EditMappingTitleSection : it displays the title input field along with text.
 *
 * @author Naveen Muthusamy <naveen@wordlift.io>
 * @since 3.25.0
 */

/**
 * External dependencies
 */
import React from "react";
import { connect } from "react-redux";
/**
 * Internal dependencies
 */

import { TITLE_CHANGED_ACTION } from "../../actions/actions";
import { TitleArea } from "./title-area";

// Set a reference to the WordLift's Edit Mapping settings stored in the window instance.
const editMappingSettings = window["wl_edit_mappings_config"] || {};

class _EditMappingTitleSection extends React.Component {
  constructor(props) {
    super(props);
    this.handleTitleChange = this.handleTitleChange.bind(this);
  }
  handleTitleChange(event) {
    TITLE_CHANGED_ACTION.payload = {
      value: event.target.value
    };
    this.props.dispatch(TITLE_CHANGED_ACTION);
  }
  render() {
    return (
      <React.Fragment>
        <TitleArea
          mappingId={editMappingSettings.wl_edit_mapping_id}
          addMappingText={editMappingSettings.wl_add_mapping_text}
          editMappingText={editMappingSettings.wl_edit_mapping_text}
        />
        <input
          type="text"
          className="wl-container__input--full-width wl-container__input--height-medium"
          value={this.props.title}
          placeholder="Title"
          onChange={e => {
            this.handleTitleChange(e);
          }}
        />
        <br /> <br />
      </React.Fragment>
    );
  }
}

export const EditMappingTitleSection = connect(state => ({
  title: state.TitleSectionData.title
}))(_EditMappingTitleSection);
