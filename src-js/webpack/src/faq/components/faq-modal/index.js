/**
 * FaqModal shows the apply list.
 * @since 3.26.0
 * @author Naveen Muthusamy
 *
 */
/**
 * External dependencies.
 */
import React from "react";
import { connect } from "react-redux";
/**
 * Internal dependencies.
 */
import { updateFaqModalVisibility } from "../../actions";
import "./index.scss";
import { WlModal } from "../../blocks/wl-modal";
import { WlModalHeader } from "../../blocks/wl-modal/wl-modal-header";
import { WlModalBody } from "../../blocks/wl-modal/wl-modal-body";
import FaqApplyList from "../faq-apply-list";

class FaqModal extends React.Component {
  render() {
    return (
      <React.Fragment>
        <WlModal shouldOpenModal={this.props.isModalOpened}>
          <WlModalHeader
            title={"Wordlift FAQ"}
            description={"Apply this answer to a question"}
            modalCloseClickedListener={() => {
              const action = updateFaqModalVisibility();
              action.payload = false;
              this.props.dispatch(action);
            }}
          />
          <WlModalBody>
            <FaqApplyList />
          </WlModalBody>
        </WlModal>
      </React.Fragment>
    );
  }
}
export default connect(state => ({
  isModalOpened: state.faqModalOptions.isModalOpened
}))(FaqModal);