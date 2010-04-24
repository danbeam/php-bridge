/*
 * A JavaScript to PHP Bridge Concept
 * http://danbeam.org/phpbridge/
 *
 * Copyright (c) 2010 Dan Beam
 * Dual licensed under the MIT and GPL licenses.
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.opensource.org/licenses/gpl-2.0.php
 */

var $pb =
{
	"bind" : function( name, functions )
	{
		var func;

		while( "undefined" !== typeof( func = functions.pop( ) ) )
		{
			// bind the function name to this (the original class)
			this[ func ] = new Function( "return $pb.bridge('" + name + "','" + func + "', arguments );" );
		}
	},

	"bridge" : function( )
	{
		// create a &key=val URL encoded list of data
		var	postData = "class=" + arguments[ 0 ] + "&function=" + arguments[ 1 ] + $pb.toData( arguments[ 2 ] );
		
		// use our ajax function to send them to bridge
		return window.xhrs.post
		(
			{
				"url"		: "handler.php",
				"data"		: postData,
				"async"		: false,
				"cache"		: false
			}
		).responseText;
		
	},

	"debug" : function( msg ){ ( ( "undefined" === typeof window.console && window.console.log ) || window.alert )( msg ); },

	"load" : function( name, callback )
	{
		// create a new <script> tag with that source
		var script = document.createElement( "script" );
		script.setAttribute( "src", "showbridge.php?class=" + encodeURIComponent( name ) );
		document.getElementsByTagName( "body" )[ 0 ].appendChild( script );

		/* onload enhancements from http://stevesouders.com/efws/script-onload.php */

		// set semaphore to false
		script.doneLoading = false;

		// in everything but IE
		script.onload = function( )
		{ 
			if ( !script.doneLoading )
			{
				script.doneLoading = true;
				callback( );
			}
		};

		// IE
		script.onreadystatechange = function( )
		{ 
			if ( ( "loaded" === script.readyState || "complete" === script.readyState ) && !script.doneLoading )
			{
				script.doneLoading = true;
				callback( );
			}
		};
	},
	
	"toData" : function( args, keys )
	{
		var data = "";
		
		keys = "undefined" === typeof keys ? [ ] : keys;

		// we're at a terminal state
		if( /number|string|boolean/.test( typeof args ) || null === args )
		{
			data += "&args[" + keys.join( "][" ) + "]=" + ( null === args ? "null" : args.toString( ) );
		}

		// we found an array or an object with a length
		else if( args instanceof Array || ( "object" === typeof args && args.length ) )
		{
			for( var i = 0; i < args.length; ++i )
			{
				// when we recurse this is passed by reference
				keys.push( i );
						
				// else add the value after it's been re-iterated
				data += $pb.toData( args[ i ], keys );

				keys.pop( );
			}
		}

		// we found an object
		else if( "object" === typeof args && null !== args )
		{
			var key;

			for( key in args )
			{
				// when we recurse this is passed by reference
				keys.push( key );
				
				// otherwise recursively keep adding
				data += $pb.toData( args[ key ], keys );

				keys.pop( );
			}
		}

		// don't know how to handle this type
		else
		{
			throw "Type not allowed";
		}
		
		return data;
	}
};
