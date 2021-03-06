<?php
/**
 * Genesis Framework.
 *
 * WARNING: This file is part of the core Genesis Framework. DO NOT edit this file under any circumstances.
 * Please do all modifications in the form of a child theme.
 *
 * @package StudioPress\Genesis
 * @author  StudioPress
 * @license GPL-2.0-or-later
 * @link    https://my.studiopress.com/themes/genesis/
 */

$genesis_contributors_list = require GENESIS_CONFIG_DIR . '/contributors.php';
$genesis_contributors      = new Genesis_Contributors( $genesis_contributors_list );
$genesis_allowed_code      = array(
	'code' => array(),
	'a'    => array( 'href' => array() ),
);
?>
<div class="wrap about-wrap">

<h1><?php echo esc_html( get_admin_page_title() ); ?></h1>

<p class="about-text"><?php esc_html_e( 'Genesis 2.10 adds new WP-CLI commands and a new Genesis Plugins page that helps you discover and install Genesis plugins.', 'genesis' ); ?></p>

<div class="changelog">
	<div class="feature-section">
		<h2 class="screen-reader-text"><?php esc_html_e( 'Changes', 'genesis' ); ?></h2>

		<h3><?php esc_html_e( 'New WP-CLI Commands', 'genesis' ); ?></h3>
		<p><?php esc_html_e( 'If you are a developer who loves Genesis and also enjoys using WP-CLI to manage your site, things are about to get a whole lot easier.', 'genesis' ); ?></p>
		<p><?php esc_html_e( 'Genesis 2.10 introduces a few key WP-CLI commands that should help you with common tasks like checking the current version of Genesis, upgrading, and managing theme settings.', 'genesis' ); ?></p>
		<p><?php esc_html_e( 'For a list of new commands, see the updated documentation.', 'genesis' ); ?></p>

		<h3><?php esc_html_e( 'Install Genesis Plugins', 'genesis' ); ?></h3>
		<p><?php esc_html_e( 'Chances are, you have probably used one of the many Genesis plugins available on WordPress.org. But the process for finding official plugins from the StudioPress team and installing them on your site has been a little difficult in the past.', 'genesis' ); ?></p>
		<p><?php esc_html_e( 'In Genesis 2.10, if you look under the Genesis admin menu, you will see a new link, "Genesis Plugins".', 'genesis' ); ?></p>
		<p><?php esc_html_e( 'This new link will allow you to view and install, right from your dashboard, the most popular plugins StudioPress has created.', 'genesis' ); ?></p>

		<h3><?php esc_html_e( 'Moving to the Customizer', 'genesis' ); ?></h3>
		<p><?php esc_html_e( 'Genesis 2.10 will begin the process of moving our settings management to the WordPress Customizer. The Genesis Settings and SEO Settings admin menu links now take you to the appropriate Customizer panel, where you can manage your settings just as before.', 'genesis' ); ?></p>
		<p><?php esc_html_e( 'We think this move will help make your Genesis experience more consistent with the way you are already managing your WordPress site, as well as making the process for registering and exposing settings far more simple.', 'genesis' ); ?></p>

		<h3><?php esc_html_e( 'The Details', 'genesis' ); ?></h3>
		<p>
		<?php
		printf(
			wp_kses(
				// Translators: Link to the changelog.
				__( 'We keep a detailed changelog for each release, which can be found <a href="%s">here</a>.', 'genesis' ),
				$genesis_allowed_code
			),
			'https://genesischangelog.com/'
		);
		?>
		</p>

</div>

<div class="project-leads">

	<h2><?php esc_html_e( 'Project Leads', 'genesis' ); ?></h2>

	<ul class="wp-people-group " id="wp-people-group-project-leaders">
		<?php
		$genesis_lead_developers = $genesis_contributors->find_by_role( 'lead-developer' );
		foreach ( $genesis_lead_developers as $genesis_lead_developer ) {
			printf(
				'<li class="wp-person">' .
				'<a href="%1$s"><img src="%2$s" alt="%3$s" class="gravatar" /></a><a class="web" href="%1$s">%4$s</a>' .
				'<span class="title">%5$s</span>' .
				'</li>' . "\n",
				esc_url( $genesis_lead_developer->get_profile_url() ),
				esc_url( $genesis_lead_developer->get_avatar_url() ),
				esc_attr( $genesis_lead_developer->get_name() ),
				esc_html( $genesis_lead_developer->get_name() ),
				esc_html( $genesis_lead_developer->get_named_role() )
			);
		}
		?>
	</ul>

</div>

<div class="contributors">

	<h2><?php esc_html_e( 'Contributors', 'genesis' ); ?></h2>

	<ul class="wp-people-group" id="wp-people-group-contributing-developers">
		<?php
		$genesis_current_contributors = $genesis_contributors->find_contributors();
		foreach ( $genesis_current_contributors as $genesis_current_contributor ) {
			printf(
				'<li class="wp-person">' .
				'<a href="%1$s"><img src="%2$s" alt="%3$s" class="gravatar" /></a><a class="web" href="%1$s">%4$s</a>' .
				'<span class="title">%5$s</span>' .
				'</li>' . "\n",
				esc_url( $genesis_current_contributor->get_profile_url() ),
				esc_url( $genesis_current_contributor->get_avatar_url() ),
				esc_attr( $genesis_current_contributor->get_name() ),
				esc_html( $genesis_current_contributor->get_name() ),
				esc_html( $genesis_current_contributor->get_named_role() )
			);
		}
		?>
	</ul>

</div>

<div class="return-to-dashboard">
	<p><a href="<?php echo esc_url( menu_page_url( 'genesis', 0 ) ); ?>"><?php esc_html_e( 'Go to Theme Settings &rarr;', 'genesis' ); ?></a></p>
	<?php if ( ! genesis_seo_disabled() ) : ?>
	<p><a href="<?php echo esc_url( menu_page_url( 'seo-settings', 0 ) ); ?>"><?php esc_html_e( 'Go to SEO Settings &rarr;', 'genesis' ); ?></a></p>
	<?php endif; ?>

</div>

</div>
