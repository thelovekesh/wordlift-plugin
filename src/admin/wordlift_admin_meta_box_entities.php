<?php

/**
 * This file provides methods and functions to generate entities meta-boxes in the admin UI.
 */

/**
 * Adds the entities meta box (called from *add_meta_boxes* hook).
 *
 * @param string $post_type The type of the current open post.
 */
function wl_admin_add_entities_meta_box( $post_type ) {
    wl_write_log("wl_admin_add_entities_meta_box [ post type :: $post_type ]");
    
    // Add meta box for related entities (separated from the others for historical reasons)
    add_meta_box(
            'wordlift_entities_box', __('Related Entities', 'wordlift'), 'wl_entities_box_content', $post_type, 'side', 'high'
    );

    // Add meta box for specific type of entities
    $entity_id = get_the_ID();
    $entity_type = wl_entity_get_type($entity_id);

    if ( isset($entity_id) && is_numeric($entity_id) && isset( $entity_type['custom_fields'] ) ) {
        
        // In some special case, properties must be grouped in one metabox (e.g. coordinates)
        $metaboxes = wl_entities_metaboxes_group_properties_by_input_field( $entity_type['custom_fields'] );
        $simple_metaboxes = $metaboxes[0];
        $grouped_metaboxes = $metaboxes[1];
        
        // Loop over simple entity properties
        foreach( $simple_metaboxes as $key => $property ) {

            // Metabox title
            $title = __( 'Edit', 'wordlift' ) . ' ' . __( $property['predicate'], 'wordlift' );
            
            // Info passed to the metabox
            $info = array();
            $info[ $key ] = $property;
            
            $unique_metabox_name = uniqid('wl_metabox_');

            switch( $property['type'] ) {
                case WL_DATA_TYPE_URI:
                    add_meta_box(
                        $unique_metabox_name, $title, 'wl_entities_uri_box_content', $post_type, 'side', 'high', $info
                    );
                    break;
                case WL_DATA_TYPE_DATE:
                    add_meta_box(
                        $unique_metabox_name, $title, 'wl_entities_date_box_content', $post_type, 'side', 'high', $info
                    );
                    break;
                case WL_DATA_TYPE_INTEGER:
                    add_meta_box(
                        $unique_metabox_name, $title, 'wl_entities_int_box_content', $post_type, 'side', 'high', $info
                    );
                    break;
                case WL_DATA_TYPE_DOUBLE:
                    add_meta_box(
                        $unique_metabox_name, $title, 'wl_entities_double_box_content', $post_type, 'side', 'high', $info
                    );
                    break;
                case WL_DATA_TYPE_BOOLEAN:
                    add_meta_box(
                        $unique_metabox_name, $title, 'wl_entities_bool_box_content', $post_type, 'side', 'high', $info
                    );
                    break;
                case WL_DATA_TYPE_STRING:
                    add_meta_box(
                        $unique_metabox_name, $title, 'wl_entities_string_box_content', $post_type, 'side', 'high', $info
                    );
                    break;
            }
        }
        
        // Loop over grouped properties
        foreach( $grouped_metaboxes as $key => $property ) {
            
            // Metabox title
            $title = __( 'Edit', 'wordlift' ) . ' ' . __( $key, 'wordlift' );

            switch( $key ) {
                case 'coordinates':
                    add_meta_box(
                        'wordlift_coordinates_entities_box', $title, 'wl_entities_coordinates_box_content', $post_type, 'side', 'high'
                    );
                    break;
            }
        }
    }
}

/**
 * Separes metaboxes in simple and grouped (called from *wl_admin_add_entities_meta_box*).
 *
 * @param array $custom_fields Information on the entity type.
 */
function wl_entities_metaboxes_group_properties_by_input_field( $custom_fields ) {
    
    $simple_properties = array();
    $grouped_properties = array();
    
    // Loop over possible entity properties
    foreach( $custom_fields as $key => $property ) {
        
        // Check presence of predicate and type
        if( isset( $property['predicate'] ) && isset( $property['type'] ) ) {
            
            // Check if input_field is defined
            if( isset( $property['input_field'] ) && $property['input_field'] !== '' ) {
                
                $grouped_key = $property['input_field'];
                
                // Update list of grouped properties
                $grouped_properties[$grouped_key][$key] = $property;
       
            } else {
                
                // input_field not defined, add simple metabox
                $simple_properties[$key] = $property;
            }
        }
    }
    
    return array( $simple_properties, $grouped_properties );
}

add_action('add_meta_boxes', 'wl_admin_add_entities_meta_box');

/**
 * Displays the meta box contents (called by *add_meta_box* callback).
 *
 * @param WP_Post $post The current post.
 */
function wl_entities_box_content($post) {

    wl_write_log("wl_entities_box_content [ post id :: $post->ID ]");

    // get the related entities IDs.
    $related_entities_ids = wl_get_referenced_entity_ids($post->ID);

    if (!is_array($related_entities_ids)) {
        wl_write_log("related_entities_ids is not of the right type.");

        // print an empty entities array.
        wl_entities_box_js(array());
        return;
    }

    // check if there are related entities.
    if (!is_array($related_entities_ids) || 0 === count($related_entities_ids)) {
        _e('No related entities', 'wordlift');

        // print an empty entities array.
        wl_entities_box_js(array());
        return;
    }

    // The Query
    $args = array(
        'post_status' => 'any',
        'post__in' => $related_entities_ids,
        'post_type' => 'entity'
    );
    $query = new WP_Query($args);
    $related_entities = $query->get_posts();

    // Print out each entity.
    foreach ($related_entities as $related_entity) {
        echo('<a href="' . get_edit_post_link($related_entity->ID) . '">' . $related_entity->post_title . '</a><br>');
    }

    // Print the JavaScript representation of the entities.
    wl_entities_box_js($related_entities);
}

/**
 * Print out a javascript representation of the provided entities collection.
 * @param array $entities An array of entities.
 */
function wl_entities_box_js($entities) {

    echo <<<EOF
    <script type="text/javascript">
        jQuery( function() {
            var e = {};

EOF;

    foreach ($entities as $entity) {
        // uri
        $uri = json_encode(wl_get_entity_uri($entity->ID));
        // entity object
        $obj = json_encode(wl_serialize_entity($entity));

        echo "e[$uri] = $obj;";
    }

    echo <<<EOF
        if ('undefined' == typeof window.wordlift) {
            window.wordlift = {}
        }
        window.wordlift.entities = e;

        } );
    </script>
EOF;
}

/**
 * Displays the date meta box contents (called by *add_meta_box* callback).
 *
 * @param WP_Post $post The current post.
 * @param $info Array The custom_field the method must manage.
 */
function wl_entities_date_box_content( $post, $info ) {

    // Which meta/custom_field are we managing?
    $custom_field = $info['args'];
    $meta_name = ( array_keys( $custom_field ) );
    $meta_name = $meta_name[0];
    
    // Include datePicker and timePicker on page
    //wp_enqueue_script('jquery-ui-datepicker');    // Only let us choose date; we need date and time
    wp_enqueue_style(
            'datetimepickercss', plugins_url('js-client/datetimepicker/jquery.datetimepicker.css', __FILE__)
    );
    wp_enqueue_script(
            'datetimepickerjs', plugins_url('js-client/datetimepicker/jquery.datetimepicker.js', __FILE__)
    );

    // Set nonce
    wl_echo_nonce( $meta_name );
    
    $date = get_post_meta($post->ID, $meta_name, true);
    $date = esc_attr($date);

    echo '<input type="text" id="' . $meta_name . '" name="wl_metaboxes[' . $meta_name . ']" value="' . $date . '" style="width:100%" />';

    echo "<script type='text/javascript'>
    $ = jQuery;
    $(document).ready(function() {
        $('#" . $meta_name . "').datetimepicker();
    });
    </script>";
}

/**
 * Displays the string meta box contents (called by *add_meta_box* callback).
 *
 * @param WP_Post $post The current post.
 * @param $info Array The custom_field the method must manage.
 */
function wl_entities_string_box_content( $post, $info ) {

    // Which meta/custom_field are we managing?
    $custom_field = $info['args'];
    $meta_name = ( array_keys( $custom_field ) );
    $meta_name = $meta_name[0];

    // Set nonce
    wl_echo_nonce( $meta_name );
    
    $default = get_post_meta($post->ID, $meta_name, true);

    echo '<input type="text" id="' . $meta_name . '" name="wl_metaboxes[' . $meta_name . ']" value="' . $default . '" style="width:100%" />';
}

/**
 * Displays the coordinates meta box contents (called by *add_meta_box* callback).
 *
 * @param WP_Post $post The current post.
 */
function wl_entities_coordinates_box_content($post) {
    
    // Add leaflet css and library.
    wp_enqueue_style(
            'leaflet_css', plugins_url('bower_components/leaflet/dist/leaflet.css', __FILE__)
    );
    wp_enqueue_script(
            'leaflet_js', plugins_url('bower_components/leaflet/dist/leaflet.js', __FILE__)
    );
    
    // Set nonce for both meta (latitude and longitude)
    wl_echo_nonce( WL_CUSTOM_FIELD_GEO_LATITUDE );
    wl_echo_nonce( WL_CUSTOM_FIELD_GEO_LONGITUDE );
    
    // Get coordinates
    $coords = wl_get_coordinates($post->ID);
    $latitude = $coords['latitude'];
    $longitude = $coords['longitude'];
    
    // Default coords values [0, 0]
    if( !isset( $longitude ) || !is_numeric( $longitude ))
        $longitude = 0.0;
    if( !isset( $latitude ) || !is_numeric( $latitude ))
        $latitude = 0.0;
    
    // Default zoom value
    if( $latitude==0.0 || $longitude==0.0 ) {
        $zoom = 1;  // Choose from a world panoramic
    } else {
        $zoom = 9;  // Close up view
    }
    
    // Print input fields
    echo '<label for="wl_place_lat">' . __('Latitude', 'wordlift') . '</label>';
    echo '<input type="text" id="wl_place_lat" name="wl_metaboxes[' . WL_CUSTOM_FIELD_GEO_LATITUDE . ']" value="' . $latitude . '" style="width:100%" />';

    echo '<label for="wl_place_lon">' . __('Longitude', 'wordlift') . '</label>';
    echo '<input type="text" id="wl_place_lon" name="wl_metaboxes[' . WL_CUSTOM_FIELD_GEO_LONGITUDE . ']" value="' . $longitude . '" style="width:100%" />';

    // Show Leaflet map to pick coordinates
    echo "<div id='wl_place_coords_map'></div>";
    echo "<script type='text/javascript'>
    $ = jQuery;
    $(document).ready(function(){
        $('#wl_place_coords_map').width('100%').height('200px');
        var wlMap = L.map('wl_place_coords_map').setView([$latitude, $longitude], $zoom);
    
        L.tileLayer( 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
            { attribution: '&copy; <a href=http://osm.org/copyright>OpenStreetMap</a> contributors'}
        ).addTo( wlMap );
        
        var marker = L.marker([$latitude, $longitude]).addTo( wlMap );
    
        function refreshCoords(e) {
            $('#wl_place_lat').val( e.latlng.lat );
            $('#wl_place_lon').val( e.latlng.lng );
            marker.setLatLng( e.latlng )
        }

        wlMap.on('click', refreshCoords);
    });
    </script>";
}

/**
 * Displays jQuery autocomplete in a meta box, to assign an entity as property value (e.g. location of an Event).
 * The assigned entity can also be created on the fly.
 *
 * @param WP_Post $post The current post.
 * @param $info Array The custom_field the method must manage.
 */
function wl_entities_uri_box_content( $post, $info ) {
    
    // Which meta/custom_field are we managing?
    $custom_field = $info['args'];
    $meta_name = ( array_keys( $custom_field ) );
    $meta_name = $meta_name[0];
    
    // Which type of entity is object?
    if( isset( $custom_field[$meta_name]['constraints']['uri_type'] ) ) {
        // Specific type (e.g. Place, Event, ecc.)
        $expected_type = $custom_field[$meta_name]['constraints']['uri_type'];
    } else {
        // Any entity
        $expected_type = null;
    }
    
    // Set Nonce
    wl_echo_nonce( $meta_name );
    
    // Get default value, if any
    $defaultEntity = get_post_meta( $post->ID, $meta_name, true );
    
    // Is there a value?
    if( $defaultEntity !== '' ) {
        // Is the value an ID or a string? 
        if( is_numeric( $defaultEntity ) ) {
            $defaultEntity = get_post( $defaultEntity );
            $defaultEntity->uri = wl_get_entity_uri( $defaultEntity->ID );
        } else {
            // Is the entity external or internal?
            $defaultEntityTmp = wl_get_entity_post_by_uri( $defaultEntity );
            if( is_null( $defaultEntityTmp ) ) {
                // external entity
                $defaultEntity->uri = $defaultEntity;
            } else {
                $defaultEntity = $defaultEntityTmp;
                $defaultEntity->uri = wl_get_entity_uri( $defaultEntity->ID );
            }
        }
    }

    // Search entities of the expected type
    $args = array(
        'posts_per_page'                => -1,
        'orderby'                       => 'RECENCYYYYYYYY',
        'post_type'                     => WL_ENTITY_TYPE_NAME,
        WL_ENTITY_TYPE_TAXONOMY_NAME    => $expected_type
    ); 
    $candidates = get_posts( $args );
    
    // Write Autocomplete selection
    if( count( $candidates ) > 0 ) {
        // Input to show the autocomplete options
        echo '<input id="autocompleteEntity" style="width:100%" >';
        // Input to store the actual chosen values ( autocomplete quirks... )
        echo '<input type="hidden" id="autocompleteEntityHidden" name="wl_metaboxes[' . $meta_name . ']">';
        // Input to create new entity (insert uri or just give a name)
        $placeholder = __('Insert uri or just a name', 'wordlift');
        echo '<input id="autocompleteCreateNew" placeholder="' . $placeholder . '" style="width:100%" >';
        
        
        // Add jQuery Autocomplete
        wp_enqueue_script( 'jquery-ui-autocomplete' );
 
        // Filter $candidates to only contain id, name and uri
        $simpleCandidates = array_map(function($p) {
            return array(
                'value' => wl_get_entity_uri( $p->ID ),
                'label' => $p->post_title ); 
        }, $candidates);
        
        // Add null value (to delete location)
        $nullCandidate = array(
            'value' => '',
            'label' => __('< no location >', 'wordlift') );
        array_unshift( $simpleCandidates, $nullCandidate );
        
        // Add null value (to delete location)
        $newCandidate = array(
            'value' => '§',
            'label' => __('< create new >', 'wordlift') );
        array_unshift( $simpleCandidates, $newCandidate );
        
        // Add to Autocomplete available place
        wp_localize_script( 'jquery-ui-autocomplete', 'availableEntities',
            array(
                'list'      => $simpleCandidates,
                'default'   => $defaultEntity
            )
        );

        echo "<script type='text/javascript'>
        $ = jQuery;
        $(document).ready(function() {
            var selector = '#autocompleteEntity';               // to display labels
            var createNewSelector = '#autocompleteCreateNew';   // to insert new entitiy
            var hiddenSelector = '#autocompleteEntityHidden';   // to contain the value to be saved
            
            // 'create new' input
            $(createNewSelector).hide()     // Starts hidden
                .change( function(){        // keyboard event
                    $(hiddenSelector).val( $(this).val() );
                });
                
            // Default label and value
            if( availableEntities.default.hasOwnProperty( 'uri' ) ){
                $(selector).val( availableEntities.default.post_title );
                $(hiddenSelector).val( availableEntities.default.uri );
            }
            
            // Init autocomplete
            $(selector).autocomplete({
                minLength: 0,
                source: availableEntities.list,
                select: function( event, ui ){
                    // Display label but store value in the hidden <input>
                    event.preventDefault();
                    $(selector).val( ui.item.label );
                    $(hiddenSelector).val( ui.item.value );

                    if( $(hiddenSelector).val() === '§' ){
                        $(createNewSelector).show();
                        $(createNewSelector).focus();
                        $(hiddenSelector).val('');
                    } else {
                        $(createNewSelector).hide();
                    }
                },
                focus: function( event, ui ) {
                    // Do not show values instead of the label
                    event.preventDefault();
                    $(selector).val(ui.item.label);
                }
            });
            
        });
        </script>";
    } else {
        echo __('No entities of the right type found.', 'wordlift');
    }
}

/**
 * Saves the values of wordlift metaboxes set in the entity editor page
 */
function wl_entity_metabox_save($post_id) {
    
    if( !isset( $_POST['wl_metaboxes'] ) ) {
        return;
    }
    
    // Loop over the wl_metaboxes array and save metaboxes values
    foreach( $_POST['wl_metaboxes'] as $meta_name => $meta_value ) {
        
        // First, verify nonce is set for this meta
        $nonce_name = 'wordlift_' . $meta_name . '_entity_box_nonce';
        $nonce_verify = 'wordlift_' . $meta_name . '_entity_box';
        if ( !isset( $_POST[$nonce_name] ) )
            return $post_id;
        
        // Verify that the nonce is valid.
        if ( !wp_verify_nonce( $_POST[$nonce_name], $nonce_verify ) )
            return $post_id;
        
        // Save the property value
        if ( isset( $meta_name ) && isset( $meta_value ) ) {
            wl_write_log('piedo ');
            wl_write_log('piedo ' . $meta_name . ' ' . $meta_value);
            // If the meta expects an entity...
            $expecting_uri = ( wl_get_meta_type( $meta_name ) === WL_DATA_TYPE_URI );
            wl_write_log(' piedo expecting uri: ' . $expecting_uri);
            // ...and contains an entity that is not present in the db...
            $absent_from_db = is_null( wl_get_entity_post_by_uri( $meta_value ) );
            wl_write_log(' piedo absent from db: ' . $absent_from_db);
            // ...but is not an external uri
            $external_uri = strpos( $meta_value, 'http') === 0;
            wl_write_log(' piedo external uri: ' . $external_uri);
            if( $expecting_uri && $absent_from_db && !$external_uri ) {
                // ...we create a new entity!
                $name = esc_attr( $meta_value );
                //$new_entity_id = wl_create_post('', $meta_value, $meta_value, 'publish', 'entity');
                
                // Assign type
                // TODO: Where do I get the type without the schema address ?
                //wl_set_entity_main_type( $new_entity_id, 'http://schema.org/Place' );
                
                // Rewrite meta value in the new version
                //$meta_value = wl_get_entity_uri( $new_entity_id );
            }
            
            update_post_meta( $post_id, $meta_name, $meta_value );  
        } else {
            delete_post_meta( $post_id, $meta_name );
        }
    }
}
add_action( 'save_post', 'wl_entity_metabox_save' );


function wl_echo_nonce( $meta_name ) {
    wp_nonce_field( 'wordlift_' . $meta_name . '_entity_box', 'wordlift_' . $meta_name . '_entity_box_nonce' );
}