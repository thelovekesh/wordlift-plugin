import { trigger } from "backbone";
import { FAQ_EVENT_HANDLER_SELECTION_CHANGED } from "../../constants/faq-hook-constants";
import GutenbergFormatTypeHandler from "./gutenberg-format-type-handler";
import GutenbergHighlightHandler from "./gutenberg-highlight-handler";
import { getCurrentSelectionHTML } from "./helpers";
import GutenbergToolbarHandler from "./gutenberg-toolbar-handler";

export const FAQ_GUTENBERG_TOOLBAR_BUTTON_CLASS_NAME = "wl-faq-gutenberg-toolbar-button";
/**
 * Register all the format types required by FAQ
 * for the gutenberg
 */
const formatTypeHandler = new GutenbergFormatTypeHandler();
formatTypeHandler.registerAllFormatTypes();

const highlightHandler = new GutenbergHighlightHandler();
/**
 * Event handler / store emits highlight event upon faqitem
 * save or edit.
 */
highlightHandler.listenForHighlightEvent();

/**
 * Initialize event handler to listen for text selection,
 * enable/disable the toolbar button.
 */
new GutenbergToolbarHandler();
/**
 * Register the toolbar button and the format.
 */
(function(wp) {
  const AddFaqButton = function(props) {
    return wp.element.createElement(wp.editor.RichTextToolbarButton, {
      title: "Add Question / Answer",
      icon: "plus",
      className: FAQ_GUTENBERG_TOOLBAR_BUTTON_CLASS_NAME,
      onClick: function() {
        /**
         * We pass props.value in to extras, in order to make
         * gutenberg highlight on the highlight event.
         */
        highlightHandler.props = props;
        const { text, start, end } = props.value;
        const selectedText = text.slice(start, end);
        trigger(FAQ_EVENT_HANDLER_SELECTION_CHANGED, {
          selectedText: selectedText,
          selectedHTML: getCurrentSelectionHTML()
        });
      }
    });
  };

  wp.richText.registerFormatType("wordlift/faq-plugin", {
    title: "Add Question/Answer",
    tagName: "faq-gutenberg",
    className: null,
    edit: AddFaqButton
  });
})(window.wp);
