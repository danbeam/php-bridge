<?php

// create a blanket method that handles exceptions
set_exception_handler( 'handleExceptions' );

// start output buffering (gzipping if possible)
ob_start( );

// validate class name
$class = strtolower( basename( $_REQUEST[ 'class' ] ) );
if( '' === $class ){ throw new Exception( 'Class name is required' ); }

// validate function name
$func = basename( $_REQUEST[ 'function' ] );
if( '' === $class ){ throw new Exception( 'Class name is required' ); }

// see if file even exists
if( !is_file( 'bridges/class.' . $class . '.php' ) ){ throw new Exception( 'Class does not exist' ); }

// see if we have read access
if( !is_readable( 'bridges/class.' . $class . '.php' ) ){ throw new Exception( 'Bridge file lacks read access' ); }

// include the file, there could exceptions in the code as well...
include_once 'bridges/class.' . $class . '.php';

// check to see if the class has that method
if( !method_exists( $class, $func ) ){ throw new Exception( $class . '::' . $func . ' not found' ); }

// attempt to call the function
echo call_user_func( array( $class, $func ), $_POST[ 'args' ] );

// success, flush output!
ob_end_flush( );

// I think this is easier than a try { } catch ( ){ } block
function handleExceptions( $e )
{
	// remove error text
	ob_clean( );

	// create generic exception
	$error = array( "exception" => array( "message" => $e->getMessage( ) ) );

	// don't show internal errors
	if( __FILE__ !== $e->getFile( ) )
	{
		$error = array_merge
		(
			$error,

			array
			(
				"line"		=> $e->getLine( ),
				"file"		=> $e->getFile( ),
				"trace"		=> $e->getTrace( )
			)
		);
	}

	// don't know how long the data will be...
	ob_start( );
	echo json_encode( $error );
	ob_end_flush( );
}

?>
