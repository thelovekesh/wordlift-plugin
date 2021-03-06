/**
 * This file contains actions and reducer associated with the Create Entity Form container.
 *
 * @author Naveen Muthusamy <naveen@wordlift.io>
 * @since 3.23.0
 */

/**
 * @const ADD_NEW_RULE
 * constant used for add new rule action
 */
export const ADD_NEW_RULE = "ADD_NEW_RULE";

/**
 * @const ADD_NEW_RULE_GROUP
 * constant used for add new rule group action
 */
export const ADD_NEW_RULE_GROUP = "ADD_NEW_RULE_GROUP";

/**
 * @const DELETE_RULE
 * constant used for add delete rule
 */
export const DELETE_RULE = "DELETE_RULE";

/**
 * @const CHANGE_RULE_FIELD_VALUE
 * change a individual rule field option
 */
export const CHANGE_RULE_FIELD_VALUE = "CHANGE_RULE_FIELD_VALUE";

/**
 * @const OPEN_OR_CLOSE_PROPERTY
 * Action to open/close a property item for editing
 */
export const OPEN_OR_CLOSE_PROPERTY = "OPEN_OR_CLOSE_PROPERTY";

/**
 * @const PROPERTY_DATA_CHANGED
 * Action when a property data of an item gets changed
 */
export const PROPERTY_DATA_CHANGED = "PROPERTY_DATA_CHANGED";

/**
 * @const ADD_MAPPING
 * Action when add mapping button is clicked
 */
export const ADD_MAPPING = "ADD_MAPPING";

/**
 * @const TITLE_CHANGED
 * Action when add mapping button is clicked
 */
export const TITLE_CHANGED = "TITLE_CHANGED";

/**
 * @const PROPERTY_LIST_CHANGED
 * Action when property list changed by data from api.
 */
export const PROPERTY_LIST_CHANGED = "PROPERTY_LIST_CHANGED";

/**
 * @const RULE_GROUP_LIST_CHANGED
 * Action when rule group list changed by data from api.
 */
export const RULE_GROUP_LIST_CHANGED = "RULE_GROUP_LIST_CHANGED";

/**
 * @const MAPPING_HEADER_CHANGED
 * Action when mapping header is changed by api, usually consists of title and mapping id.
 */
export const MAPPING_HEADER_CHANGED = "MAPPING_HEADER_CHANGED";

/**
 * @const NOTIFICATION_CHANGED
 * Action when notification is sent by api.
 */
export const NOTIFICATION_CHANGED = "NOTIFICATION_CHANGED";

/**
 * @const MAPPING_LIST_CHANGED
 * Action when notification is sent by api.
 */
export const MAPPING_LIST_CHANGED = "MAPPING_LIST_CHANGED";

/**
 * @const MAPPING_LIST_SORT_TITLE_CHANGED
 * Action when user want to sort the title asc/desc
 */
export const MAPPING_LIST_SORT_TITLE_CHANGED = "MAPPING_LIST_SORT_TITLE_CHANGED";

/**
 * @const MAPPING_ITEM_CATEGORY_CHANGED
 * Action when notification is sent by api.
 */
export const MAPPING_ITEM_CATEGORY_CHANGED = "MAPPING_ITEM_CATEGORY_CHANGED";

/**
 * @const MAPPING_LIST_BULK_SELECT
 * Action when mapping items needed to be selected / unselected
 */
export const MAPPING_LIST_BULK_SELECT = "MAPPING_LIST_BULK_SELECT";

/**
 * @const MAPPING_LIST_CHOOSEN_CATEGORY_CHANGED
 * Action when mapping items needed to be selected / unselected
 */
export const MAPPING_LIST_CHOOSEN_CATEGORY_CHANGED = "MAPPING_LIST_CHOOSEN_CATEGORY_CHANGED";

/**
 * @const MAPPING_ITEM_SELECTED
 * Action when mapping item is selected.
 */
export const MAPPING_ITEM_SELECTED = "MAPPING_ITEM_SELECTED";

/**
 * @const PROPERTY_ITEM_CATEGORY_CHANGED
 * Action when category of property item changes.
 */
export const PROPERTY_ITEM_CATEGORY_CHANGED = "PROPERTY_ITEM_CATEGORY_CHANGED";

/**
 * @const PROPERTY_LIST_SELECTED_CATEGORY_CHANGED
 * Action when the choosen category of property list changed.
 */
export const PROPERTY_LIST_SELECTED_CATEGORY_CHANGED = "PROPERTY_LIST_SELECTED_CATEGORY_CHANGED";

/**
 * @const PROPERTY_ITEM_CRUD_OPERATION
 * Action when we need to perform crud operation
 */
export const PROPERTY_ITEM_CRUD_OPERATION = "PROPERTY_ITEM_CRUD_OPERATION";

/**
 * @const BULK_ACTION_SELECTION_CHANGED
 * Action when we change the bulk action component
 */
export const BULK_ACTION_SELECTION_CHANGED = "BULK_ACTION_SELECTION_CHANGED";

/**
 * @const PROPERTY_ITEM_SELECTED
 * Action when property item is selected by user.
 */
export const PROPERTY_ITEM_SELECTED = "PROPERTY_ITEM_SELECTED";

/**
 * @const PROPERTY_ITEM_SELECT_ALL
 * Action when the user want to select all the items in the category.
 */
export const PROPERTY_ITEM_SELECT_ALL = "PROPERTY_ITEM_SELECT_ALL";

/**
 * @const PROPERTY_ITEMS_BULK_SELECT
 * Action when the user wants to make bulk action on selected properties
 */
export const PROPERTY_ITEMS_BULK_SELECT = "PROPERTY_ITEMS_BULK_SELECT";

/**
 * @const EDIT_MAPPING_REQUEST_TERMS
 * Send the request to get the terms for the selected taxonomy.
 */
export const EDIT_MAPPING_REQUEST_TERMS = "EDIT_MAPPING_REQUEST_TERMS";

/**
 * @const EDIT_MAPPING_TERMS_FETCHED_FOR_TAXONOMY
 * Action type when a network request is sent to fetch the taxonomy.
 */
export const EDIT_MAPPING_TERMS_FETCHED_FOR_TAXONOMY = "EDIT_MAPPING_TERMS_FETCHED_FOR_TAXONOMY";

/**
 * @const EDIT_MAPPING_SAVE_MAPPING_ITEM
 * Action type when we need to save mapping item.
 */
export const EDIT_MAPPING_SAVE_MAPPING_ITEM = "EDIT_MAPPING_SAVE_MAPPING_ITEM";

/**
 * @const EDIT_MAPPING_REQUEST_MAPPING_ITEM
 * Action type when we need to get the mapping item from API.
 */
export const EDIT_MAPPING_REQUEST_MAPPING_ITEM = "EDIT_MAPPING_REQUEST_MAPPING_ITEM";

/**
 * @const MAPPING_ITEMS_BULK_APPLY
 * Action when the user wants to make bulk action on selected mapping items
 */
export const MAPPING_ITEMS_BULK_APPLY = "MAPPING_ITEMS_BULK_APPLY";

/**
 * @const MAPPING_ID_CHANGED_FROM_API
 * Action when the mapping id changes from add new mapping post.
 */
export const MAPPING_ID_CHANGED_FROM_API = "MAPPING_ID_CHANGED_FROM_API";

/**
 * @const MAPPING_TERMS_CHANGED
 * Action type when the mapping taxonomy terms are loaded from the rest api.
 */
export const MAPPING_TERMS_CHANGED = "MAPPING_TERMS_CHANGED";

/**
 * @const MAPPINGS_REQUEST
 * Action type when the ui makes the request to get mappings from API.
 */
export const MAPPINGS_REQUEST = "MAPPINGS_REQUEST";

/**
 * @const MAPPINGS_REQUEST_DELETE_OR_UPDATE
 * Action type when the ui makes the request to delete or update mappings from the api.
 */
export const MAPPINGS_REQUEST_DELETE_OR_UPDATE = "MAPPINGS_REQUEST_DELETE_OR_UPDATE";

/**
 * @const MAPPINGS_REQUEST_CLONE_MAPPINGS
 * Action type when the ui makes the request to clone mapping items.
 */
export const MAPPINGS_REQUEST_CLONE_MAPPINGS = "MAPPINGS_REQUEST_CLONE_MAPPINGS";

/**
 * @const MAPPINGS_RESET_UI_AFTER_BULK_APPLY
 * Reset the ui state after applying the bulk action.
 */
export const MAPPINGS_RESET_UI_AFTER_BULK_APPLY = "MAPPINGS_RESET_UI_AFTER_BULK_APPLY";
