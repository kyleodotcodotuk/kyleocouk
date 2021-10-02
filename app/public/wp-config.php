<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'local' );

/** MySQL database username */
define( 'DB_USER', 'root' );

/** MySQL database password */
define( 'DB_PASSWORD', 'root' );

/** MySQL hostname */
define( 'DB_HOST', 'localhost' );

/** Database Charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8' );

/** The Database Collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         'DwjOBC2PR20yjgvOqF18MKdO7yPWexR4UdcZjcZc/olTNoDI0BN7wJ7S7xophjOOS0qBlGnCX4tAra6RhNlzzg==');
define('SECURE_AUTH_KEY',  'imOnOjclWSHHTM8Bb3HGsaXv2+hUEjIssyq9ZV6b7l0je9X7Iwd12Kw5mXjxPGtPW5i60CRKzPK8OlEiGwLvnw==');
define('LOGGED_IN_KEY',    'G14keNEUmN8clZ4aQf3I5Lguisl+35pureaaLC69zffUPzhiwXnO1nwf+AKMptKUDUjBsx2cRKvAb9uIKaurXg==');
define('NONCE_KEY',        'BvDRSabLpsByoVRFCrRHkKK3b0vgd/BIh/GyzXhXjmcCKBO+xmBtB2VN8AG8ZtybnEAhFspj5WHQBEREGSHtag==');
define('AUTH_SALT',        'UMRs6Jm/v3t3C+v5PGkrfWb9fxBEvd89doMS+vY2pR+4eLOkFO2vnJpZpN76OjIWVqp1CoHHbI4f7r8UZpWx2w==');
define('SECURE_AUTH_SALT', 'lKGzLYCkmxaBWawCEzt+Xuwc2ZhtR23RmSATico6fAkn5OgbrdIogG2zypxWsBBNCM0uIRvuJrdQfUI+zMxUoQ==');
define('LOGGED_IN_SALT',   '3TqfdOdRAKkR5PQVPoN5+mw2y2h9XP90NCT87uuhTC1T20mbb/sT4dwFvfc6ACBRBXeiUBRjPlVDKSuv0mjqQQ==');
define('NONCE_SALT',       'Dgv6r2epJc8jjsUK5x1Ojdhi+SMK6QSZQNpc0zyRIFEGT55b8s0HLPSFLKpnC0sh8ziBjqQxh9Dd8wKYKnGahw==');

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';




/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', dirname( __FILE__ ) . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
