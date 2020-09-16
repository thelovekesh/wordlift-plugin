<?php

namespace Wordlift\Duplicate_Markup_Remover;

class Faq_Duplicate_Markup_Remover {

	public function __construct() {
		add_filter( 'wl_after_get_jsonld', array( $this, 'wl_after_get_jsonld' ), 10, 2 );
	}

	/**
	 * @param $jsonld array The final jsonld.
	 * @param $post_id int The post id.
	 */
	public function wl_after_get_jsonld( $jsonld, $post_id ) {

		// Check if the current page is faq page.
		if ( ! is_array( $jsonld )
		     || ! count( $jsonld ) > 1
		     || ! array_key_exists( 0, $jsonld ) ) {
			// Return early if there are no referenced entities.
			return $jsonld;
		}

		if ( ( is_string( $jsonld[0]['@type'] ) && $jsonld[0]['@type'] !== 'FAQPage' )
		     || ( is_array( $jsonld[0]['@type'] ) && ! in_array( 'FAQPage', $jsonld[0]['@type'] ) ) ) {
			// Return early if the current page is not a faq page.
			return $jsonld;
		}


		$post_jsonld = array_shift( $jsonld );

		// If the current page is a  faq page, then we need to loop through all the items and remove the faq markup.
		foreach ( $jsonld as $key => $value ) {
			if ( ! array_key_exists( '@type', $value ) ) {
				continue;
			}
			$type = $value['@type'];
			// If the referenced entity is purely a faq page, the remove it.
			if ( is_string( $type ) && $type === 'FAQPage' ) {
				// Remove the entity completely.
				unset( $jsonld[ $key ] );
			}
		}

		// Add the post jsonld to front of jsonld array.
		array_unshift( $jsonld, $post_jsonld );

		return $jsonld;
	}


}