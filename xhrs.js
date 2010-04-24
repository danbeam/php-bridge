/*
 * XHR Secure - A Simple Class for making XMLHttpRequests
 * http://danbeam.org/phpbridge/
 *
 * Copyright (c) 2010 Dan Beam
 * Dual licensed under the MIT and GPL licenses.
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.opensource.org/licenses/gpl-2.0.php
 */

var xhrs =
(
	function( $window )
	{
		var send = function( args )
		{
			if( ! "url" in args ){ throw "You must specify a URL"; }

			var	xhr = ( function( )
				{
					try { return new $window.ActiveXObject( "Msxml2.XMLHTTP" );	} catch( e ){ }
					try { return new $window.ActiveXObject( "Microsoft.XMLHTTP" );	} catch( f ){ }
					try { return new $window.XMLHttpRequest( );			} catch( g ){ }
					return null;
				} )( );

			if( null !== xhr )
			{
				// set defaults
				var	method		= "method"	in args ? args.method	: "GET",
					data		= "data"	in args ? args.data	: null,
					type		= "type"	in args ? args.type	: "application/x-www-form-urlencoded",
					async		= "async"	in args ? !!args.async	: true,
					cache		= "cache"	in args ? !!args.cache	: true,
					maxTime		= "timeout"	in args ? args.timeout	: 20000,
					username	= "username"	in args ? args.username	: false,
					password	= "password"	in args ? args.password	: false,
					headers		= "headers"	in args ? args.headers	: { },
					success		= "success"	in args ? args.success	: function( ){ },
					error		= "error"	in args ? args.error	: function( ){ };
					

				// this is in the spec, so it's here as well (user/pass), though I've NEVER used it
				if( false !== username )
				{
					if( false !== password ){ xhr.open( method, args.url, async, username, password ); }
					else { xhr.open( method, args.url, async, username ); }
				}

				// this should be the overwhelmingly typical case
				else { xhr.open( method, args.url, async ); }

				// these will always be used
				xhr.setRequestHeader( "Content-Type", type );
				xhr.setRequestHeader( "X-Requested-With", "XMLHttpRequest" );

				if( false === cache )
				{
					var now = new Date( );

					headers.Expires = "0";
					headers[ "Cache-Control" ] = "max-age=0, no-cache, must-revalidate";
					headers[ "If-None-Match" ] = ( Math.random( ) + "" ).substr( 2 );
					headers[ "If-Modified-Since" ] = now.toGMTString( );
				}

				var	key,

					disallowed =	"Accept-Charset|Accept-Encoding|Connection|Content-Length|Cookie|Cookie2|Content-Transfer-Encoding|Date|" +
							"Expect|Host|Keep-Alive|Referer|TE|Trailer|Transfer-Encoding|Upgrade|User-Agent|Via|(Proxy-.*)|(Sec-.*)",

					disallowedReg = new RegExp( disallowed, "i" );
			
				// pass in additional headers (if specified and good to do)
				for( key in headers )
				{
					if( ! disallowedReg.test( key ) ){ xhr.setRequestHeader( key, headers[ key ] ); }
				}

				// start the XHR
				xhr.send( /post|put|delete/i.test( method ) ? data : null );

				// set a timeout on the request
				var timeout = $window.setTimeout( function( ){ doneHandler( xhr, success, error ); }, maxTime );

				// if it was a synchronous request, return the result
				if( false === async )
				{
					doneHandler( xhr, success, error );
					return xhr;
				}
				else // asynchronous
				{
					// add a readystate handler for when it's done
					xhr.onreadystatechange = function( ){ if( 4 == xhr.readyState ){ doneHandler( xhr, success, error ); } };
					return;
				}
			}

			// this would be sad, :_(
			else { throw "Your browser doesn't support AJAX."; }
		},

		doneHandler = function( xhr, success, error )
		{
			// success
			if( 200 == xhr.status ){ success.call( xhr, xhr.responseText ); }

			else // not a success
			{
				try
				{
					// this might throw error
					xhr.responseText;
					error.call( xhr, xhr.status, xhr.responseText );
				}
				catch( h )
				{
					// responseText not availabe
					error.call( xhr, xhr.status );
				}
			}

			try { $window.clearTimeout( timeout ); } catch( i ){ }
		};

		return(
		{
			"get"		: function( args ){ args.method = "GET"; return send( args ); },
			"post"		: function( args ){ args.method = "POST"; return send( args ); },
			"head"		: function( args ){ args.method = "HEAD"; return send( args ); },
			"put"		: function( args ){ args.method = "PUT"; return send( args ); },
			"delete"	: function( args ){ args.method = "DELETE"; return send( args ); },
			"options"	: function( args ){ args.method = "OPTIONS"; return send( args ); }
		});
	}
)( window );
