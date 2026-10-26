<?php
/**
 * Plugin Name: Ganesh Case Studies (headless)
 * Description: "casestudy" post type for ganeshunnam.com. Exposes fields over the REST API and triggers a static rebuild on GitHub when a case study is published, updated or removed.
 * Version:     1.0.0
 * Author:      Ganesh Unnam
 * Requires PHP: 8.0
 *
 * wp-config.php:
 *   define( 'GCS_GITHUB_REPO',  'Gane2506/ganeshunnam-web' );
 *   define( 'GCS_GITHUB_TOKEN', 'github_pat_…' ); // fine-grained PAT: this repo only, Contents: read & write
 *   define( 'GCS_FRONTEND_URL', 'https://ganeshunnam.com' );
 */

defined( 'ABSPATH' ) || exit;

const GCS_TYPE = 'casestudy';

/* ---------------------------------------------------------------- post type */
add_action( 'init', 'gcs_register' );

function gcs_register(): void {
	register_post_type( GCS_TYPE, [
		'labels'       => [
			'name'          => 'Case Studies',
			'singular_name' => 'Case Study',
			'add_new_item'  => 'Add case study',
			'edit_item'     => 'Edit case study',
		],
		'public'       => true,
		'has_archive'  => true,
		'rewrite'      => [ 'slug' => 'casestudy', 'with_front' => false ],
		'menu_icon'    => 'dashicons-portfolio',
		'show_in_rest' => true,
		'rest_base'    => 'casestudy',
		'supports'     => [ 'title', 'editor', 'excerpt', 'thumbnail', 'revisions', 'custom-fields' ],
	] );

	$text = [ 'cs_client', 'cs_year', 'cs_role', 'cs_type', 'cs_stack' ];
	foreach ( $text as $key ) {
		register_post_meta( GCS_TYPE, $key, [
			'type'              => 'string',
			'single'            => true,
			'show_in_rest'      => true,
			'sanitize_callback' => 'sanitize_text_field',
			'auth_callback'     => fn() => current_user_can( 'edit_posts' ),
		] );
	}
	foreach ( [ 'cs_palette_primary', 'cs_palette_secondary' ] as $key ) {
		register_post_meta( GCS_TYPE, $key, [
			'type'              => 'string',
			'single'            => true,
			'show_in_rest'      => true,
			'sanitize_callback' => fn( $v ) => sanitize_hex_color( $v ) ?: '',
			'auth_callback'     => fn() => current_user_can( 'edit_posts' ),
		] );
	}
	register_post_meta( GCS_TYPE, 'cs_live_url', [
		'type'              => 'string',
		'single'            => true,
		'show_in_rest'      => true,
		'sanitize_callback' => 'esc_url_raw',
		'auth_callback'     => fn() => current_user_can( 'edit_posts' ),
	] );
	register_post_meta( GCS_TYPE, 'cs_metrics', [
		'type'          => 'array',
		'single'        => true,
		'default'       => [],
		'auth_callback' => fn() => current_user_can( 'edit_posts' ),
		'show_in_rest'  => [
			'schema' => [
				'type'  => 'array',
				'items' => [
					'type'       => 'object',
					'properties' => [
						'value' => [ 'type' => 'string' ],
						'label' => [ 'type' => 'string' ],
					],
				],
			],
		],
	] );
}

/* ---------------------------------------------------------------- edit screen */
const GCS_FIELDS = [
	'cs_client'            => [ 'Client', 'text', 'e.g. Vinyl Sound' ],
	'cs_year'              => [ 'Year', 'text', 'e.g. 2025' ],
	'cs_role'              => [ 'Role', 'text', 'e.g. Lead developer' ],
	'cs_type'              => [ 'Type', 'text', 'AI · Web · E-commerce · Automation · Infra' ],
	'cs_stack'             => [ 'Stack (comma separated)', 'text', 'Shopify, Liquid, Klaviyo' ],
	'cs_live_url'          => [ 'Live URL', 'url', 'https://' ],
	'cs_palette_primary'   => [ 'Primary colour', 'color', '' ],
	'cs_palette_secondary' => [ 'Secondary colour', 'color', '' ],
];

add_action( 'add_meta_boxes', function () {
	add_meta_box( 'gcs_details', 'Case study details', 'gcs_render_box', GCS_TYPE, 'normal', 'high' );
} );

function gcs_render_box( WP_Post $post ): void {
	wp_nonce_field( 'gcs_save', 'gcs_nonce' );
	echo '<table class="form-table" role="presentation">';
	foreach ( GCS_FIELDS as $key => [ $label, $type, $placeholder ] ) {
		$value = get_post_meta( $post->ID, $key, true );
		if ( 'color' === $type && ! $value ) {
			$value = 'cs_palette_primary' === $key ? '#c6f432' : '#2de2a6';
		}
		printf(
			'<tr><th><label for="%1$s">%2$s</label></th><td><input class="regular-text" type="%3$s" id="%1$s" name="%1$s" value="%4$s" placeholder="%5$s"></td></tr>',
			esc_attr( $key ), esc_html( $label ), esc_attr( $type ), esc_attr( $value ), esc_attr( $placeholder )
		);
	}
	$metrics = array_map(
		fn( $m ) => ( $m['value'] ?? '' ) . ' | ' . ( $m['label'] ?? '' ),
		(array) get_post_meta( $post->ID, 'cs_metrics', true )
	);
	printf(
		'<tr><th><label for="cs_metrics">Metrics</label></th><td><textarea class="large-text" rows="4" id="cs_metrics" name="cs_metrics" placeholder="+30% | online sales">%s</textarea><p class="description">One per line: <code>value | label</code></p></td></tr>',
		esc_textarea( implode( "\n", $metrics ) )
	);
	echo '</table><p class="description">The primary colour tints the 3D particles and accents on the case study page.</p>';
}

add_action( 'save_post_' . GCS_TYPE, function ( int $post_id ) {
	if ( ! isset( $_POST['gcs_nonce'] ) || ! wp_verify_nonce( sanitize_key( $_POST['gcs_nonce'] ), 'gcs_save' ) ) {
		return;
	}
	if ( wp_is_post_autosave( $post_id ) || ! current_user_can( 'edit_post', $post_id ) ) {
		return;
	}
	foreach ( array_keys( GCS_FIELDS ) as $key ) {
		if ( isset( $_POST[ $key ] ) ) {
			update_post_meta( $post_id, $key, wp_unslash( $_POST[ $key ] ) ); // sanitized by register_post_meta
		}
	}
	if ( isset( $_POST['cs_metrics'] ) ) {
		$rows = preg_split( '/\r?\n/', sanitize_textarea_field( wp_unslash( $_POST['cs_metrics'] ) ) );
		$out  = [];
		foreach ( $rows as $row ) {
			[ $value, $label ] = array_pad( array_map( 'trim', explode( '|', $row, 2 ) ), 2, '' );
			if ( '' !== $value ) {
				$out[] = [ 'value' => $value, 'label' => $label ];
			}
		}
		update_post_meta( $post_id, 'cs_metrics', $out );
	}
} );

/* ---------------------------------------------------------------- rebuild trigger */
// Publishing, editing a published post, unpublishing or trashing all queue one rebuild.
// A short delay coalesces bursts of saves (block editor + meta box) into a single GitHub dispatch.
add_action( 'transition_post_status', function ( string $new, string $old, WP_Post $post ) {
	if ( GCS_TYPE !== $post->post_type || ( 'publish' !== $new && 'publish' !== $old ) ) {
		return;
	}
	if ( ! wp_next_scheduled( 'gcs_dispatch_rebuild' ) ) {
		wp_schedule_single_event( time() + 20, 'gcs_dispatch_rebuild' );
		spawn_cron();
	}
}, 10, 3 );

add_action( 'gcs_dispatch_rebuild', function () {
	if ( ! defined( 'GCS_GITHUB_REPO' ) || ! defined( 'GCS_GITHUB_TOKEN' ) ) {
		error_log( '[ganesh-casestudy] GCS_GITHUB_REPO / GCS_GITHUB_TOKEN missing; skipping rebuild.' );
		return;
	}
	$res = wp_remote_post( 'https://api.github.com/repos/' . GCS_GITHUB_REPO . '/dispatches', [
		'timeout' => 15,
		'headers' => [
			'Accept'               => 'application/vnd.github+json',
			'Authorization'        => 'Bearer ' . GCS_GITHUB_TOKEN,
			'X-GitHub-Api-Version' => '2022-11-28',
			'User-Agent'           => 'ganesh-casestudy',
		],
		'body'    => wp_json_encode( [ 'event_type' => 'cms-publish' ] ),
	] );
	$code = is_wp_error( $res ) ? $res->get_error_message() : wp_remote_retrieve_response_code( $res );
	if ( 204 !== $code ) {
		error_log( '[ganesh-casestudy] GitHub dispatch failed: ' . print_r( $code, true ) );
	}
} );

/* ---------------------------------------------------------------- headless hardening */
// Visitors to the CMS front end are sent to the real site; wp-admin, REST, cron and previews still work.
add_action( 'template_redirect', function () {
	if ( is_admin() || is_preview() || wp_doing_cron() || ( defined( 'REST_REQUEST' ) && REST_REQUEST ) ) {
		return;
	}
	$front = defined( 'GCS_FRONTEND_URL' ) ? GCS_FRONTEND_URL : 'https://ganeshunnam.com';
	$path  = is_singular( GCS_TYPE ) ? '/casestudy/' . get_post_field( 'post_name' ) . '/' : '/';
	wp_redirect( untrailingslashit( $front ) . $path, 301 );
	exit;
} );

add_filter( 'xmlrpc_enabled', '__return_false' );
add_action( 'send_headers', fn() => header( 'X-Robots-Tag: noindex, nofollow' ) );

register_activation_hook( __FILE__, function () {
	gcs_register();
	flush_rewrite_rules();
} );
register_deactivation_hook( __FILE__, 'flush_rewrite_rules' );
