<?php

/**
 * @author  Reza Marandi <ross@artbees.net>
 * @version 1.0.0
 */

class mk_db_management {


	protected $backup_directory_name = 'mk_backup';
	private $errors;

	private $backup_path;
	public function set_backup_path( $backup_path ) {
		$this->backup_path = trim( rtrim( $backup_path, DIRECTORY_SEPARATOR ) ) . DIRECTORY_SEPARATOR . $this->backup_directory_name;
		return $this;
	}
	public function get_backup_path() {
		return $this->backup_path;
	}

	private $mysqldump_method;
	public function set_mysqldump_method( $mysqldump_method ) {
		$this->mysqldump_method = $mysqldump_method;
		return $this;
	}
	public function get_mysqldump_method() {
		return $this->mysqldump_method;
	}

	private $mysqldump_command_path;
	public function set_mysqldump_command_path( $mysqldump_command_path ) {
		$this->mysqldump_command_path = $mysqldump_command_path;
		return $this;
	}

	private $response;
	public function set_response( $response ) {
		$this->response = $response;
		return $this;
	}
	public function get_response() {
		return $this->response;
	}
	public function get_response_message() {
		$system_response = $this->get_response();
		if ( isset( $system_response['message'] ) ) {
			return $system_response['message'];
		}
		return null;
	}
	public function get_response_status() {
		$system_response = $this->get_response();
		if ( isset( $system_response['status'] ) ) {
			return $system_response['status'];
		}
		return null;
	}
	public function get_response_data() {
		$system_response = $this->get_response();
		if ( isset( $system_response['data'] ) ) {
			return $system_response['data'];
		}
		return null;
	}

	private $mysqldump_cmd_path;
	public function set_mysqldump_cmd_path( $mysqldump_cmd_path ) {
		$this->mysqldump_cmd_path = $mysqldump_cmd_path;
		return $this;
	}
	public function get_mysqldump_cmd_path() {
		return $this->mysqldump_cmd_path;
	}

	private $cleanup_time_frame;
	public function set_cleanup_time_frame( $cleanup_time_frame ) {
		$this->cleanup_time_frame = $cleanup_time_frame;
		return $this;
	}
	public function get_cleanup_time_frame() {
		return $this->cleanup_time_frame;
	}
	/*====================== MAIN SECTION ============================*/

	public function __construct() {
		$this->set_backup_path( ABSPATH . 'wp-content/mk_template' );
		$this->set_cleanup_time_frame( '1 week' );

		// The cleaning checks daily, but only will remove backups that is older than cleanup_time_frame value.
		add_action( 'jupiter_backup_directory_cleanup', array( $this, 'cleanup' ) );
		if ( ! wp_next_scheduled( 'jupiter_backup_directory_cleanup' ) ) {
			wp_schedule_event( time(), 'daily', 'jupiter_backup_directory_cleanup' );
		}
	}
	public function backup_db() {
		try {

			/* Begin : Create backup directory , check permission and secure it */
			Abb_Logic_Helpers::checkPermAndCreate( $this->get_backup_path() );
			$this->secure_backup_directory( $this->get_backup_path() );

			/* Create random file name for backup */
			$site_name             = preg_replace( '/[^A-Za-z0-9_]/', '_', get_bloginfo( 'name' ) );
			$db_file_name          = date( 'Y_m_d_H_i_s' ) . '__' . substr( md5( uniqid() ), 0, 7 ) . '_' . $site_name . '_mkdb';
			$db_sql_name           = $db_file_name . '.sql';
			$db_sql_file_path      = $this->get_backup_path() . DIRECTORY_SEPARATOR . $db_sql_name;
			$db_compress_name      = $db_file_name . '.zip';
			$db_compress_file_path = $this->get_backup_path() . DIRECTORY_SEPARATOR . $db_compress_name;

			/* Begin : Check if SQL file can be created or not */
			if ( file_put_contents( $db_sql_file_path, '' ) === false ) {
				throw new Exception( 'Can not create backup db file.' );
				return false;
			}
			@chmod( $db_sql_file_path, 0664 );
			/* Begin : Generate SQL DUMP using cmd */
			if ( $this->get_mysqldump_command_path() ) {
				if ( $this->mysqldump( $db_sql_file_path ) ) {
					$sql_dump_flag = 1;
				} else {
					$sql_dump_flag = 0;
				}
			}
			if ( empty( $sql_dump_flag ) ) {
				$response = $this->wpdb_backup_procedure( $db_sql_file_path );
			}

			/* Begin : Verifying backed up database file */
			if ( ! $this->verify_backup( $db_sql_file_path ) ) {
				throw new Exception( 'Backup file is not created in right approach , try again.' );
				return false;
			}

			/*
			 Begin : Compressing backed up database file */
			if ( Abb_Logic_Helpers::zip( array( $db_sql_name => $db_sql_file_path ), $db_compress_file_path ) ) {
				@unlink( $db_sql_file_path );
				$compress_file_flag = true;
			}

			$this->message( 'Backup Successfuly created', true );
			return true;

		} catch (Exception $e) {
			$this->message( $e->getMessage(), false );
			return false;
		}// End try().
	}

	public function date_compare($a, $b) {
		$t1 = strtotime($a['created_date']);
		$t2 = strtotime($b['created_date']);
		return $t1 - $t2;
	}

	public function get_wpdb_error ($wpdb_error) {
		$mes = '';
		if($wpdb_error->last_error !== '') {
			$str   = htmlspecialchars( $wpdb_error->last_error, ENT_QUOTES );
			$query = htmlspecialchars( $wpdb_error->last_query, ENT_QUOTES );
			$mes = "WordPress database error: [$str] => [$query]";
		}
		return $mes;
	}

	public function is_restore_db() {
		/* BEGIN: Get the list of backup files and sort them by created date */
		$list_of_backups = $this->list_of_backups();
		usort($list_of_backups, array($this, "date_compare"));

		/* BEGIN: Get the lastest backup file by date */
		/* If the number of backup file is greater than 1, get the backup file before the last element */
		$latest_backup_file = end($list_of_backups);
		reset($list_of_backups);

		$result = array(
			'list_of_backups'		 => $list_of_backups,
			'latest_backup_file' => $latest_backup_file
		);

		return $result;
	}

	public function restore_latest_db() {
		global $wpdb;
		global $wp_filesystem;
		$wpdb->suppress_errors = false;
		$wpdb->show_errors = false;

		/* BEGIN: Get the list of backup files and sort them by created date */
		$list_of_backups = $this->list_of_backups();
		usort($list_of_backups, array($this, "date_compare"));

		/* BEGIN: Get the lastest backup file by date */
		$latest_backup_file = end($list_of_backups);
		reset($list_of_backups);

		/* BEGIN: Unzip the file */
		WP_Filesystem();
		$ext_path_info = $this->get_backup_path();
		$database_zip_file = $latest_backup_file['full_path'];
		$unzipfile = unzip_file( $database_zip_file, $ext_path_info);
		if ( !$unzipfile ) {
			throw new Exception( 'There was an error unzipping the file.' );
			return false;
		}

		/* Define DB Name and error message */
		$database_name = DB_NAME;

		try {
			/* BEGIN: Create the Database */
			$sql = 'CREATE DATABASE IF NOT EXISTS `'.$database_name.'`';
			$wpdb->query($wpdb->prepare( $sql ));
			if ($this->get_wpdb_error($wpdb) !== '') {
				throw new Exception($this->get_wpdb_error($wpdb));
			}

			/* BEGIN: Retrieve All Tables from the Database */
			$tables = $this->get_tables();

			/* BEGIN: Restore Database Content */
			$sql_file = explode('/', $database_zip_file);
			$tmp_arr = explode('.', $sql_file[count($sql_file) - 1]);
			$sql_file[count($sql_file) - 1] = ($tmp_arr[0] . '.sql');
			$database_file = implode('/', $sql_file);

			if (file_exists($database_file)) {
				$sql_path_info = explode('/', $database_file);
				$database_file_name = $sql_path_info[count($sql_path_info) - 1];
				$upload_dir = wp_upload_dir();
				$file_url = $upload_dir['baseurl']. "/mk_templates/mk_backup/" . $database_file_name;
				$wp_remote_get_file = wp_remote_get( $file_url );

				// Fix an issue related to ssl enabled sites
				$wp_remote_get_file_body = "";
				if(is_array($wp_remote_get_file) and array_key_exists('body', $wp_remote_get_file)) {
					$wp_remote_get_file_body = $wp_remote_get_file['body'];
				} else if (is_numeric(strpos($file_url, "https://"))) {
					$file_url = str_replace("https://","http://",$file_url);
					$wp_remote_get_file = wp_remote_get($file_url);
					$wp_remote_get_file_body = $wp_remote_get_file['body'];
				}

				if( is_array($wp_remote_get_file) ) {
					$sql_file = $wp_remote_get_file_body;
					$sql_queries   = explode(";\n", $sql_file);

					foreach ($tables as $table_name) {
						/* BEGIN: Remove Table from the Database */
						$sql = "DROP TABLE `" .  $database_name . "`.`" . $table_name .  "`";
						$wpdb->query($wpdb->prepare( $sql ));

						/* BEGIN: Restore Table Content */
						$idxs_used = array();
						for ($i = 0; $i < count($sql_queries); $i++) {
							if (strpos($sql_queries[$i], $table_name) !== false) {
								$wpdb->query($wpdb->prepare( $sql_queries[$i] ));
								array_push($idxs_used, $i);
							}
						}
						// Remove used queries to make second loop faster
						for ($i = 0; $i < count($idxs_used); $i++) {
							$idx = $idxs_used[i];
							unset($sql_queries[$idx]);
						}
					}
				} else {
					throw new Exception( 'There was an error reading the SQL file.' );
					return false;
				}
			} else {
				throw new Exception( 'The SQL file not found.' );
				return false;
			}


			return true;
		} catch (Exception $e) {
			$this->message( $e->getMessage(), false );
			return false;
		}// End try().
	}

	public function cleanup() {
		$list_of_backups = $this->list_of_backups();

		/* Directory is empty */
		if ( ! is_array( $list_of_backups ) || count( $list_of_backups ) < 1 ) {
			return true;
		}
		array_walk($list_of_backups, function ( &$list_of_backups_val, $key ) {
			$delete_time = date( 'Y-m-d H:i:s', strtotime( $list_of_backups_val['created_date'] . ' +' . $this->get_cleanup_time_frame() ) );
			if ( $delete_time <= date( 'Y-m-d H:i:s' ) ) {
				$response = Abb_Logic_Helpers::deleteFileNDir( $list_of_backups_val['full_path'] );
			}
		});

		return true;
	}

	/*====================== HELPERS ============================*/

	public function secure_backup_directory( $directory_path ) {
		$htaccess_content = '#These next two lines will already exist in your .htaccess file' .
			'RewriteEngine On' .
			'RewriteBase /' .
			'# Add these lines right after the preceding two' .
			'RewriteCond %{REQUEST_FILENAME} ^.*(.zip)$' .
			'RewriteCond %{HTTP_COOKIE} !^.*can_download.*$ [NC]' .
			'RewriteRule . - [R=403,L]';
		// Create an empty index.php to protext directory listing
		if ( ! file_exists( $directory_path . DIRECTORY_SEPARATOR . 'index.php' ) ) {
			if ( ! file_put_contents( $directory_path . DIRECTORY_SEPARATOR . 'index.php', '<?php echo "<h1></h1>" ?>' ) ) {
				throw new Exception( 'Can not create index , Securesection' );
			}
		}
		if ( ! file_exists( $directory_path . DIRECTORY_SEPARATOR . '.htaccess' ) ) {
			if ( ! file_put_contents( $directory_path . DIRECTORY_SEPARATOR . '.htaccess', $htaccess_content ) ) {
				throw new Exception( 'Can not create htaccess , Securesection' );
			}
		}

		return true;
	}

	public function verify_backup( $db_file_path ) {
		// If there are mysqldump errors delete the database dump file as mysqldump will still have written one
		if ( $this->get_errors( $this->get_mysqldump_method() ) && file_exists( $db_file_path ) ) {
			unlink( $db_file_path );
		}

		// If we have an empty file delete it
		if ( @filesize( $db_file_path ) === 0 ) {
			unlink( $db_file_path );
		}

		// If the file still exists then it must be good
		if ( file_exists( $db_file_path ) ) {
			return true;
		}

		return false;
	}

	/**
	 * this method is resposible to manage all the classes messages and act different on ajax mode or test mode
	 *
	 * @author Reza Marandi <ross@artbees.net>
	 *
	 * @param str   $message for example ("Successfull")
	 * @param bool  $status true or false
	 * @param mixed $data its for when ever you want to result back an array of data or anything else
	 */
	public function message( $message, $status = true, $data = null ) {
		$response = array(
			'status'  => $status,
			'message' => mk_logic_message_helper( 'db-management', $message ),
			'data'    => $data,
		);
		$this->set_response( $response );
		return true;
	}

	public function list_of_backups() {
		$backup_path = $this->get_backup_path();
		$backup_list = glob( $backup_path . '/*.{zip,sql}', GLOB_BRACE );
		array_walk($backup_list, function ( &$backup_list_val, $key ) {
			$info                 = pathinfo( $backup_list_val );
			$date                 = explode( '_', explode( '__', $info['filename'] )[0] );
			$date                 = implode( '-', array_splice( $date, 0, 3 ) ) . ' ' . implode( ':', array_splice( $date, -3 ) );
			;
			$temp['full_path']    = $backup_list_val;
			$temp['name']         = $info['filename'];
			$temp['ext']          = $info['extension'];
			$temp['created_date'] = $date;
			$backup_list_val      = $temp;
		});
		return $backup_list;
	}
	/*====================== HELPERS ABOUT DUMPING ============================*/

	public function is_safe_mode_active( $ini_get_callback = 'ini_get' ) {

		if ( ($safe_mode = @call_user_func( $ini_get_callback, 'safe_mode' )) && strtolower( $safe_mode ) != 'off' ) {
			return true;
		}

		return false;
	}

	public function is_shell_exec_available() {
		// Are we in Safe Mode
		if ( $this->is_safe_mode_active() ) {
			return false;
		}

		// Is shell_exec or escapeshellcmd or escapeshellarg disabled?
		if ( array_intersect( array( 'shell_exec', 'escapeshellarg', 'escapeshellcmd' ), array_map( 'trim', explode( ',', @ini_get( 'disable_functions' ) ) ) ) ) {
			return false;
		}

		// Can we issue a simple echo command?
		if ( ! @shell_exec( 'echo MK Backup' ) ) {
			return false;
		}

		return true;
	}

	public function get_mysqldump_command_path() {
		// Check shell_exec is available
		if ( ! $this->is_shell_exec_available() ) {
			return false;
		}
		// Does mysqldump work
		//
		if ( is_null( shell_exec( 'hash mysqldump 2>&1' ) ) ) {

			// If so store it for later
			$this->set_mysqldump_cmd_path( 'mysqldump' );

			// And return now
			return $this->mysqldump_command_path;
		}
		// List of possible mysqldump locations
		$mysqldump_locations = array(
			'/usr/local/bin/mysqldump',
			'/usr/local/mysql/bin/mysqldump',
			'/usr/mysql/bin/mysqldump',
			'/usr/bin/mysqldump',
			'/opt/local/lib/mysql6/bin/mysqldump',
			'/opt/local/lib/mysql5/bin/mysqldump',
			'/opt/local/lib/mysql4/bin/mysqldump',
			'/xampp/mysql/bin/mysqldump',
			'/Program Files/xampp/mysql/bin/mysqldump',
			'/Program Files/MySQL/MySQL Server 6.0/bin/mysqldump',
			'/Program Files/MySQL/MySQL Server 5.5/bin/mysqldump',
			'/Program Files/MySQL/MySQL Server 5.4/bin/mysqldump',
			'/Program Files/MySQL/MySQL Server 5.1/bin/mysqldump',
			'/Program Files/MySQL/MySQL Server 5.0/bin/mysqldump',
			'/Program Files/MySQL/MySQL Server 4.1/bin/mysqldump',
		);

		// Find the one which works
		foreach ( $mysqldump_locations as $location ) {
			if ( @is_executable( $this->conform_dir( $location ) ) ) {
				$this->set_mysqldump_command_path( $location );
			}
		}

		return $this->mysqldump_command_path;
	}
	public function conform_dir( $dir, $recursive = false ) {

		// Assume empty dir is root
		if ( ! $dir ) {
			$dir = '/';
		}

		// Replace single forward slash (looks like double slash because we have to escape it)
		$dir = str_replace( '\\', '/', $dir );
		$dir = str_replace( '//', '/', $dir );

		// Remove the trailing slash
		if ( $dir !== '/' ) {
			$dir = untrailingslashit( $dir );
		}

		// Carry on until completely normalized
		if ( ! $recursive && self::conform_dir( $dir, true ) != $dir ) {
			return self::conform_dir( $dir );
		}

		return (string) $dir;
	}

	public function mysqldump( $db_file_path ) {
		$this->set_mysqldump_method( 'mysqldump' );

		$host = explode( ':', DB_HOST );
		$host = reset( $host );
		$port = strpos( DB_HOST, ':' ) ? end( explode( ':', DB_HOST ) ) : '';

		// Path to the mysqldump executable
		$cmd = escapeshellarg( $this->get_mysqldump_command_path() );

		// We don't want to create a new DB
		$cmd .= ' --no-create-db';

		// Allow lock-tables to be overridden
		if ( ! defined( 'WPDB_MYSQLDUMP_SINGLE_TRANSACTION' ) || WPDB_MYSQLDUMP_SINGLE_TRANSACTION !== false ) {
			$cmd .= ' --single-transaction';
		}

		// Make sure binary data is exported properly
		$cmd .= ' --hex-blob';

		// Username
		$cmd .= ' -u ' . escapeshellarg( DB_USER );

		// Don't pass the password if it's blank
		if ( DB_PASSWORD ) {
			$cmd .= ' -p' . escapeshellarg( DB_PASSWORD );
		}

		// Set the host
		$cmd .= ' -h ' . escapeshellarg( $host );

		// Set the port if it was set
		if ( ! empty( $port ) && is_numeric( $port ) ) {
			$cmd .= ' -P ' . $port;
		}

		// The file we're saving too
		$cmd .= ' -r ' . escapeshellarg( $db_file_path );

		$wp_db_exclude_table = array();
		$wp_db_exclude_table = get_option( 'wp_db_exclude_table' );
		if ( ! empty( $wp_db_exclude_table ) ) {
			foreach ( $wp_db_exclude_table as $wp_db_exclude_table ) {
				$cmd .= ' --ignore-table=' . DB_NAME . '.' . $wp_db_exclude_table;
				// error_log(DB_NAME.'.'.$wp_db_exclude_table);
			}
		}

		// Include only current site database tables
		$tables = $this->get_tables();
		if($tables){
			$tables_cmd = array('--tables');
			foreach ( $tables as $table_name ) {
				$tables_cmd[] = DB_NAME . '.' . $table_name;
			}
			$cmd .= ' ' . implode( ' ', $tables_cmd );
		}

		// The database we're dumping
		$cmd .= ' ' . escapeshellarg( DB_NAME );

		// Pipe STDERR to STDOUT
		$cmd .= ' 2>&1';
		// Store any returned data in an error
		$stderr = shell_exec( $cmd );

		// Skip the new password warning that is output in mysql > 5.6
		if ( trim( $stderr ) === 'Warning: Using a password on the command line interface can be insecure.' ) {
			$stderr = '';
		}

		if ( $stderr ) {
			$this->error( $this->get_mysqldump_method(), $stderr );
			// error_log($stderr);
			// LOG THE ERROR IN HERE
		}

		return $this->verify_mysqldump( $db_file_path );
	}

	public function error( $context, $error ) {

		if ( empty( $context ) || empty( $error ) ) {
			return;
		}

		$this->errors[ $context ][ $_key = md5( implode( ':', (array) $error ) ) ] = $error;
	}
	public function get_errors( $context = null ) {

		if ( ! empty( $context ) ) {
			return isset( $this->errors[ $context ] ) ? $this->errors[ $context ] : array();
		}

		return $this->errors;
	}

	/*====================== HELPERS ABOUT BACKING UP WITH NATIVE WPDB ============================*/

	public function wpdb_backup_procedure( $db_file_path ) {
		global $wpdb;
		/* BEGIN : Prevent saving backup plugin settings in the database dump */
		$options_backup  = get_option( 'wp_db_backup_backups' );
		$settings_backup = get_option( 'wp_db_backup_options' );
		delete_option( 'wp_db_backup_backups' );
		delete_option( 'wp_db_backup_options' );
		/* END : Prevent saving backup plugin settings in the database dump */
		$wp_db_exclude_table = get_option( 'wp_db_exclude_table' );
		$tables              = $this->get_tables();
		$output              = '';
		foreach ( $tables as $table ) {
			if ( empty( $wp_db_exclude_table ) || ( ! (in_array( $table, $wp_db_exclude_table ))) ) {
				$result = $wpdb->get_results( "SELECT * FROM {$table}", ARRAY_N );
				$row2   = $wpdb->get_row( 'SHOW CREATE TABLE ' . $table, ARRAY_N );
				$output .= "\n\n" . $row2[1] . ";\n\n";
				for ( $i = 0; $i < count( $result ); $i++ ) {
					$row = $result[ $i ];
					$output .= 'INSERT INTO ' . $table . ' VALUES(';
					for ( $j = 0; $j < count( $result[0] ); $j++ ) {
						$row[ $j ] = $wpdb->_real_escape( $row[ $j ] );
						$output .= (isset( $row[ $j ] )) ? '"' . $row[ $j ] . '"' : '""';
						if ( $j < (count( $result[0] ) - 1) ) {
							$output .= ',';
						}
					}
					$output .= ");\n";
				}
				$output .= "\n";
			}
		}
		$wpdb->flush();
		/* BEGIN : Prevent saving backup plugin settings in the database dump */
		add_option( 'wp_db_backup_backups', $options_backup );
		add_option( 'wp_db_backup_options', $settings_backup );
		/* END : Prevent saving backup plugin settings in the database dump */
		$response = file_put_contents( $db_file_path, $output );
		if ( $response == false ) {
			return false;
		}
		@chmod( $db_file_path, 0664 );
		return true;
	}

	/**
	 * Get database tables for current site
	 *
	 * @author Sofyan Sitorus <sofyan@artbees.net>
	 *
	 */
	private function get_tables() {
		global $wpdb;
		$exclude_tables = array(
			$wpdb->base_prefix . 'users',
			$wpdb->base_prefix . 'usermeta'
		);
		$multi_site_tables = array(
			$wpdb->base_prefix . 'blogs',
			$wpdb->base_prefix . 'blog_versions',
			$wpdb->base_prefix . 'signups',
			$wpdb->base_prefix . 'site',
			$wpdb->base_prefix . 'sitemeta',
			$wpdb->base_prefix . 'sitecategories',
			$wpdb->base_prefix . 'registration_log',
		);
		$current_site_tables = array();
		$current_blog_id = get_current_blog_id();
		$tables = $wpdb->get_results( 'SHOW FULL TABLES', ARRAY_N );
		foreach ( $tables as $table ) {
			if ( isset($table[1]) && $table[1] == 'VIEW' ) {
				continue;
			}
			if( in_array( $table[0], $exclude_tables ) ){
				continue;
			}
			if( is_multisite() ){
				if( in_array( $table[0], $multi_site_tables ) ){
					continue;
				}
				if( is_main_site( $current_blog_id ) ){
					$regex = '/^'.$wpdb->prefix.'([0-9])+/i';
					if( preg_match( $regex, $table[0] ) ){
						continue;
					}
				}
				if( 0 === strpos( $table[0], $wpdb->prefix ) ){
					$current_site_tables[] = $table[0];
				}
			}else{
				$current_site_tables[] = $table[0];
			}
		}
		return apply_filters( 'mk_current_site_tables', $current_site_tables );
	}
}

global $abb_phpunit;
if ( empty( $abb_phpunit ) || $abb_phpunit == false ) {
	new mk_db_management();
}
