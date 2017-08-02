<?php

/**
 * Push the provided post to Redlink (not suitable for entities).
 *
 * @param WP_Post $post A post instance.
 */
function wl_push_post_to_redlink( $post ) {

	// If entity push is disabled, return.
	if ( get_transient( 'DISABLE_ENTITY_PUSH' ) ) {
		return;
	}

	// Defensive. making sure entities are not handled HRTime\PerformanceCounter
	if ( 'entity' === $post->post_type ) {
		return;
	}

	// Only handle published valid post types.
	if ( ! Wordlift_Entity_Service::is_valid_entity_post_type( $post->post_type ) or 'publish' !== $post->post_status ) {
		wl_write_log( "wl_push_post_to_redlink : not a post or not published [ post type :: $post->post_type ][ post status :: $post->post_status ]" );

		return;
	}

	// Get the post URI.
	$uri = wl_sparql_escape_uri( wl_get_entity_uri( $post->ID ) );

	// If the URI ends with a trailing slash, then we have a problem.
	if ( '/' === substr( $uri, - 1, 1 ) ) {

		wl_write_log( "wl_push_post_to_redlink : the URI is invalid [ post ID :: $post->ID ][ URI :: $uri ]" );

		return;
	}

	$configuration_service = Wordlift_Configuration_Service::get_instance();

	// Get the site language in order to define the literals language.
	$site_language = $configuration_service->get_language_code();

	// save the author and get the author URI.
	$author_uri = wl_sparql_escape_uri( Wordlift_User_Service::get_instance()
	                                                         ->get_uri( $post->post_author ) );

	// Get other post properties.
	$date_published      = wl_get_sparql_time( get_the_time( 'c', $post ) );
	$date_modified       = wl_get_sparql_time( wl_get_post_modified_time( $post ) );
	$title               = wordlift_esc_sparql( $post->post_title );
	$permalink           = wl_sparql_escape_uri( get_permalink( $post->ID ) );
	$user_comments_count = $post->comment_count;

	wl_write_log( "wl_push_post_to_redlink [ post_id :: $post->ID ][ type :: $post->post_type ][ slug :: $post->post_name ][ title :: $post->post_title ][ date modified :: $date_modified ][ date published :: $date_published ]" );

	// create the SPARQL query.
	$sparql = '';
	if ( ! empty( $title ) ) {
		$sparql .= "<$uri> rdfs:label '$title'@$site_language . \n";
	}

	$sparql .= "<$uri> a <http://schema.org/BlogPosting> . \n";
//	$sparql .= "<$uri> schema:url <$permalink> . \n";
	$sparql .= "<$uri> schema:datePublished $date_published . \n";
	$sparql .= "<$uri> schema:dateModified $date_modified . \n";

	// Add Location Created
	$location_created_entity_id = get_post_meta(
		$post->ID, Wordlift_Schema_Service::FIELD_LOCATION_CREATED, true
	);
	wl_write_log( "wl_push_post_to_redlink [ entity_id :: $location_created_entity_id ]" );
	if ( $location_created_entity_id ) {
		$escaped_uri = wl_sparql_escape_uri( wl_get_entity_uri( $location_created_entity_id ) );
		wl_write_log( "wl_push_post_to_redlink [ post_id :: $post->ID ][ locationCreated :: $escaped_uri ]" );
		$sparql .= "<$uri> schema:locationCreated <$escaped_uri> . \n";
	}
	// Add Topic
	$topic_entity_id = get_post_meta(
		$post->ID, Wordlift_Schema_Service::FIELD_TOPIC, true
	);
	wl_write_log( "wl_push_post_to_redlink [ entity_id :: $topic_entity_id ]" );

	if ( $topic_entity_id ) {
		$escaped_uri = wl_sparql_escape_uri( wl_get_entity_uri( $topic_entity_id ) );
		wl_write_log( "wl_push_post_to_redlink [ post_id :: $post->ID ][ topic :: $escaped_uri ]" );
		$sparql .= "<$uri> dct:subject <$escaped_uri> . \n";
	}

	if ( ! empty( $author_uri ) ) {
		$sparql .= "<$uri> schema:author <$author_uri> . \n";
	}

	$sparql .= "<$uri> schema:interactionCount 'UserComments:$user_comments_count' . \n";


	// Add SPARQL stmts to write the schema:image.
	$sparql .= wl_get_sparql_images( $uri, $post->ID );

	// Get the SPARQL fragment with the dcterms:references statement.
	$sparql .= wl_get_sparql_post_references( $post->ID );

	// create the query:
	//  - remove existing references to entities.
	//  - set the new post information (including references).
	$query = rl_sparql_prefixes() . <<<EOF
            DELETE { <$uri> dct:references ?o . }
            WHERE  { <$uri> dct:references ?o . };
            DELETE { <$uri> dct:subject ?o . }
            WHERE  { <$uri> dct:subject ?o . };
            DELETE { <$uri> schema:url ?o . }
            WHERE  { <$uri> schema:url ?o . };
            DELETE { <$uri> schema:datePublished ?o . }
            WHERE  { <$uri> schema:datePublished ?o . };
            DELETE { <$uri> schema:dateModified ?o . }
            WHERE  { <$uri> schema:dateModified ?o . };
            DELETE { <$uri> schema:locationCreated ?o . }
            WHERE  { <$uri> schema:locationCreated ?o . };
            DELETE { <$uri> a ?o . }
            WHERE  { <$uri> a ?o . };
            DELETE { <$uri> rdfs:label ?o . }
            WHERE  { <$uri> rdfs:label ?o . };
            DELETE { <$uri> schema:image ?o . }
            WHERE  { <$uri> schema:image ?o . };
            DELETE { <$uri> schema:interactionCount ?o . }
            WHERE  { <$uri> schema:interactionCount ?o . };
            DELETE { <$uri> schema:author ?o . }
            WHERE  { <$uri> schema:author ?o . };
            INSERT DATA { $sparql };
EOF;

	// Add schema:url.
	$query .= Wordlift_Schema_Url_Property_Service::get_instance()
	                                              ->get_insert_query( $uri, $post->ID );

	// execute the query.
	rl_execute_sparql_update_query( $query );
}

/**
 * Get the SPARQL fragment to set the dc:references statements.
 *
 * @param int $post_id The post ID.
 *
 * @return string The SPARQL fragment (or an empty string).
 */
function wl_get_sparql_post_references( $post_id ) {

	// Get the post URI.
	$post_uri = wordlift_esc_sparql( wl_get_entity_uri( $post_id ) );

	// Get the related entities IDs.
	$related = wl_core_get_related_entity_ids( $post_id );

	// Build the SPARQL fragment.
	$sparql = '';
	foreach ( $related as $id ) {
		$uri    = wordlift_esc_sparql( wl_get_entity_uri( $id ) );
		$sparql .= "<$post_uri> dct:references <$uri> . ";
	}

	return $sparql;
}

/**
 * Get a string representing the NS prefixes for a SPARQL query.
 *
 * @return string The PREFIX lines.
 */
function rl_sparql_prefixes() {

	$prefixes = '';
	foreach ( wl_prefixes() as $prefix => $uri ) {
		$prefixes .= "PREFIX $prefix: <$uri>\n";
	}

	return $prefixes;
}

/**
 * Escape a sparql literal.
 *
 * @deprecated use Wordlift_Sparql_Service::get_instance()->escape( $string )
 *
 * @param string $string The string to escape.
 *
 * @return string The escaped string.
 */
function wordlift_esc_sparql( $string ) {

	return Wordlift_Sparql_Service::escape( $string );
}

/**
 * Escapes an URI for a SPARQL query.
 *
 * @deprecated use return Wordlift_Sparql_Service::get_instance()->escape_uri($string)
 *
 * @since      3.0.0
 *
 * @param $string string The URI to be escaped.
 *
 * @return string The escaped URI.
 */
function wl_sparql_escape_uri( $string ) {

	return Wordlift_Sparql_Service::escape_uri( $string );
}

/**
 * Reindex Redlink triple store, enabling local entities to be found in future analyses.
 */
function wordlift_reindex_triple_store() {

	// If entity push is disabled, return.
	if ( get_transient( 'DISABLE_ENTITY_PUSH' ) ) {
		return true;
	}

	// Get the reindex URL.
	$url = wl_configuration_get_dataset_index_url();

	// Post the request.
	// wl_write_log( "wordlift_reindex_triple_store" );

	// Prepare the request.
	$args = array_merge_recursive( unserialize( WL_REDLINK_API_HTTP_OPTIONS ), array(
		'method'  => 'POST',
		'headers' => array(),
	) );

	$response = wp_remote_request( $url, $args );

	// If an error has been raised, return the error.
	if ( is_wp_error( $response ) || 200 !== $response['response']['code'] ) {

		$body = ( is_wp_error( $response ) ? $response->get_error_message() : $response['body'] );

		wl_write_log( "wordlift_reindex_triple_store : error [ url :: $url ][ args :: " );
		wl_write_log( "\n" . var_export( $args, true ) );
		wl_write_log( "[ response :: " );
		wl_write_log( "\n" . var_export( $response, true ) );
		wl_write_log( "][ body :: " );
		wl_write_log( "\n" . $body );
		wl_write_log( "]" );

		return false;
	}

	return true;
}