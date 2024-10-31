<?php
/**
 * Plugin Name: Embed Other Post
 * Description: A Gutenberg block to embed content from other posts
 * Version: 1.0.0
 * Author: Your Name
 */

if (!defined('ABSPATH')) {
    exit;
}

function embed_other_post_register_block() {
    wp_register_script(
        'embed-other-post',
        plugins_url('build/index.js', __FILE__),
        array('wp-blocks', 'wp-element', 'wp-editor', 'wp-components', 'wp-data')
    );

    register_block_type('embed-other-post/main', array(
        'editor_script' => 'embed-other-post',
        'render_callback' => 'embed_other_post_render',
        'attributes' => array(
            'selectedPostId' => array(
                'type' => 'number',
            ),
        ),
    ));
}

function embed_other_post_render($attributes, $content) {
    if (empty($attributes['selectedPostId'])) {
        return '';
    }

    // Set up the post context for inner blocks
    $post = get_post($attributes['selectedPostId']);
    if (!$post) {
        return '';
    }

    // Setup post data for inner blocks to use
    setup_postdata($post);
    $content_output = '<div class="embed-other-post-block">' . $content . '</div>';
    wp_reset_postdata();
    
    return $content_output;
}
add_action('init', 'embed_other_post_register_block'); 