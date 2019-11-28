/* globals wp */
/**
 * External dependencies.
 */
import React from "react";
import { Provider } from "react-redux";

import ButtonContainer from "../../../../Edit/components/AddEntity/ButtonContainer";
import EntitySelectContainer from "./EntitySelectContainer";
import AddEntityNoticeContainer from "../../../../block-editor/filters/add-entity-notice-container";
import CreateEntityContainer from "../../../../common/containers/create-entity-form";
import WrapperContainer from "../../../../Edit/components/AddEntity/WrapperContainer";
import Arrow from "../../../../Edit/components/Arrow";

const { Panel, PanelBody, Notice } = wp.components;

// store passed from props for Gutenberg
const AddEntity = props => (
  <Provider store={props.store}>
    <React.Fragment>
      <AddEntityNoticeContainer />
      <WrapperContainer>
        <ButtonContainer>
          <Arrow height="8px" color="white" />
        </ButtonContainer>
        <EntitySelectContainer showCreate={props.showCreate} />
      </WrapperContainer>
      <CreateEntityContainer />
    </React.Fragment>
  </Provider>
);

export default AddEntity;
