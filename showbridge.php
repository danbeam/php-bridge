<?php

// function __autoload( $name ){ require_once 'bridges/class.' . strtolower( $name ) . '.php'; }

try
{
	$class = basename( $_REQUEST[ 'class' ] );
	require_once 'bridges/class.' . strtolower( $class ) . '.php';

	//if( method_exists( $class, '__bridge' ) )
	//$prototype = call_user_func( array( $class, '__bridge' ) );

	$methods = get_class_methods( $class );

	echo
'function ' . $class . '( )
{
        // have to set this dynamically with PHP
var     name = "' . $class . '",
        
        // public methods (also from PHP)
        funcs = [ ' . ( !empty( $methods ) ? '"' . implode( $methods, '","' ) . '"' : '' ) . ' ],
        
        // what should I do with these?
        initArgs = arguments;
        
        // bind all the methods names to this object
        $pb.bind.call( this, name, funcs );
}';
	
	echo "\n\n";
}
catch( Exception $e )
{
	echo json_encode
	(
		array
		(
			"exception" =>

			array
			(
				"message"	=> $e->getMessage( ),
				"line"		=> $e->getLine( ),
				"file"		=> $e->getFile( ),
				"trace"	=> $e->getTrace( )
			)
		)
	);
}

?>
