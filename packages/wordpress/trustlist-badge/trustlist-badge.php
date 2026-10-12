<?php
/**
 * Plugin Name:       TrustList Badge
 * Plugin URI:        https://github.com/eharain/trustlist-public/tree/main/packages/wordpress
 * Description:       Show your TrustList rank badge on your site, linked to the ranking it cites. Shortcode [trustlist_badge] and a block.
 * Version:           0.1.0
 * Requires at least: 6.0
 * Requires PHP:      7.4
 * Author:            TrustList
 * Author URI:        https://trustlist.uk
 * License:           MIT
 * License URI:       https://opensource.org/license/mit
 * Text Domain:       trustlist-badge
 */

if (!defined('ABSPATH')) {
    exit;
}

if (!class_exists('TrustList\\Badge')) {
    require_once __DIR__ . '/includes/Badge.php';
}

const TRUSTLIST_BADGE_OPTION = 'trustlist_badge_settings';

/** Site-wide defaults from Settings > TrustList Badge. */
function trustlist_badge_defaults(): array
{
    $saved = get_option(TRUSTLIST_BADGE_OPTION, []);
    return [
        'type' => isset($saved['type']) && $saved['type'] === 'product' ? 'product' : 'company',
        'slug' => isset($saved['slug']) ? (string) $saved['slug'] : '',
    ];
}

/**
 * The badge HTML for a set of attributes (shortcode and block share this). Returns an HTML comment
 * instead of the badge when the attributes are incomplete or invalid, so a page never breaks.
 */
function trustlist_badge_render(array $atts): string
{
    $d = trustlist_badge_defaults();
    $o = [
        'type'    => $atts['type'] !== '' ? $atts['type'] : $d['type'],
        'slug'    => $atts['slug'] !== '' ? $atts['slug'] : $d['slug'],
        'page'    => $atts['page'],
        'edition' => $atts['edition'],
        'size'    => $atts['size'] !== '' ? $atts['size'] : 'regular',
        'label'   => $atts['label'],
    ];
    try {
        return \TrustList\Badge::html($o);
    } catch (\InvalidArgumentException $e) {
        return current_user_can('edit_posts') ? '<!-- TrustList badge: ' . esc_html($e->getMessage()) . ' -->' : '';
    }
}

function trustlist_badge_clean(array $atts): array
{
    return [
        'type'    => sanitize_key($atts['type'] ?? ''),
        'slug'    => sanitize_title($atts['slug'] ?? ''),
        'page'    => '/' . ltrim(sanitize_text_field($atts['page'] ?? ''), '/'),
        'edition' => sanitize_text_field($atts['edition'] ?? ''),
        'size'    => sanitize_key($atts['size'] ?? ''),
        'label'   => sanitize_text_field($atts['label'] ?? ''),
    ];
}

/** [trustlist_badge page="/best/web-design-agency/london" label="..."] (slug and type default to the settings). */
function trustlist_badge_shortcode($atts): string
{
    $atts = shortcode_atts(['type' => '', 'slug' => '', 'page' => '', 'edition' => '', 'size' => '', 'label' => ''], (array) $atts, 'trustlist_badge');
    return trustlist_badge_render(trustlist_badge_clean($atts));
}
add_shortcode('trustlist_badge', 'trustlist_badge_shortcode');

/** The block: server-rendered from the same function, so it prints plain HTML links. */
function trustlist_badge_register_block(): void
{
    register_block_type(__DIR__ . '/block', [
        'render_callback' => static function ($attributes) {
            return trustlist_badge_render(trustlist_badge_clean((array) $attributes));
        },
    ]);
}
add_action('init', 'trustlist_badge_register_block');

/** Settings > TrustList Badge: the listing's type and slug, set once for the whole site. */
function trustlist_badge_settings_init(): void
{
    register_setting('trustlist_badge', TRUSTLIST_BADGE_OPTION, [
        'type'              => 'array',
        'sanitize_callback' => static function ($v) {
            return [
                'type' => isset($v['type']) && $v['type'] === 'product' ? 'product' : 'company',
                'slug' => sanitize_title($v['slug'] ?? ''),
            ];
        },
        'default'           => ['type' => 'company', 'slug' => ''],
    ]);
}
add_action('admin_init', 'trustlist_badge_settings_init');

function trustlist_badge_settings_menu(): void
{
    add_options_page(__('TrustList Badge', 'trustlist-badge'), __('TrustList Badge', 'trustlist-badge'), 'manage_options', 'trustlist-badge', 'trustlist_badge_settings_page');
}
add_action('admin_menu', 'trustlist_badge_settings_menu');

function trustlist_badge_settings_page(): void
{
    if (!current_user_can('manage_options')) {
        return;
    }
    $d = trustlist_badge_defaults();
    ?>
    <div class="wrap">
        <h1><?php esc_html_e('TrustList Badge', 'trustlist-badge'); ?></h1>
        <p><?php esc_html_e('Your listing on TrustList. Its address looks like https://trustlist.uk/web-design-agency/your-company: the last part is the slug.', 'trustlist-badge'); ?></p>
        <form method="post" action="options.php">
            <?php settings_fields('trustlist_badge'); ?>
            <table class="form-table" role="presentation">
                <tr>
                    <th scope="row"><label for="tlb-type"><?php esc_html_e('Listing type', 'trustlist-badge'); ?></label></th>
                    <td>
                        <select id="tlb-type" name="<?php echo esc_attr(TRUSTLIST_BADGE_OPTION); ?>[type]">
                            <option value="company" <?php selected($d['type'], 'company'); ?>><?php esc_html_e('Company', 'trustlist-badge'); ?></option>
                            <option value="product" <?php selected($d['type'], 'product'); ?>><?php esc_html_e('Software product', 'trustlist-badge'); ?></option>
                        </select>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="tlb-slug"><?php esc_html_e('Listing slug', 'trustlist-badge'); ?></label></th>
                    <td><input id="tlb-slug" class="regular-text" name="<?php echo esc_attr(TRUSTLIST_BADGE_OPTION); ?>[slug]" value="<?php echo esc_attr($d['slug']); ?>"></td>
                </tr>
            </table>
            <?php submit_button(); ?>
        </form>
        <h2><?php esc_html_e('Showing a badge', 'trustlist-badge'); ?></h2>
        <p><?php esc_html_e('Add the TrustList Badge block, or this shortcode, with the address of the ranking you are on:', 'trustlist-badge'); ?></p>
        <p><code>[trustlist_badge page="/best/web-design-agency/london" label="TrustList: Top Web Design Agencies in London"]</code></p>
    </div>
    <?php
}
