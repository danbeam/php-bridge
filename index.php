<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
<title>danbeam.org :: PHP Bridge
</head>

<style type="text/css">

	.wrapper
	{
		text-align: left;
		border: 1px solid #d0d0d0;
		height: 100%;
		background: #ffffff;
		background: rgba(255,255,255,0.88);
		padding: 20px 40px;
		width: 600px;
	}

	.wrapper h1, .wrapper h2, .wrapper h3, .wrapper h4, div.results, button
	{
		font-family: Georgia;
		color: #333333;
	}

	.wrapper h1
	{
		margin: -20px -40px 0px -40px;
		padding: 20px 40px;
		background: #161616;
		color: #d6d6d6;
		border-bottom: 1px solid #e0e0e0;
		font-variant: small-caps;
	}

	.wrapper h2
	{
		margin: 20px 0px 5px 0px;
		padding: 0;
	}

	.wrapper h3
	{
		margin: 0;
		font-weight: normal;
	}

	.wrapper h4
	{
		margin: 20px -40px -20px -40px;
		padding: 10px;
		text-align: center;
		background: #161616;
		color: #d6d6d6;
	}

	#results
	{
		background-color: #f0f0f0;
		border: 1px solid #e0e0e0;
		padding: 20px;
		white-space: pre;
	}

	blockquote
	{
		white-space: pre;
		font-family: "Lucida Console", Lucida, "Sans sefif", Helvetica;
		font-size: 12px;
		color: #ffffff;
		background-color: #000000;
		border: 1px solid #333333;
		margin: 0;
		padding: 10px 20px;
	}

	button
	{
		border: 1px solid #e0e0e0;
		border-bottom-width: 0px;
		padding: 6px 20px;
		font-size: 14px;
		margin-bottom: -1px;
	}

	.strike
	{
		text-decoration: line-through;
	}

</style>
</head>
<body>
<div align="center">
<div class="wrapper">

<h1>A PHP Bridge</h1>

<h2>Hello!</h2>
<h3>Have you ever wanted to make a transparent proxy from JavaScript to PHP, so you can simply call PHP functions client-side?<br /><br />Me neither, but my nerdy evil twin told me it would be cool, so here it is!</h3>

<h2>Example</h2>
<h2>Results</h2>

<button id="doit">Do it!</button>
<button id="clear">Clear</button>

<div id="results"></div>

<h2>Dependencies</h2>
<h3>So I got un-lazy and wrote a fairly thorough AJAX class (only the 89 billionth in existence), so this code doesn't even require anything other than <a href="domready.js">DomReady</a> and either my <a href="xhrs.js">XHRS</a> (XHR Secure) class or your favorite AJAX method of choice (again, however, you'll have to change the code, =O).</h3>

<h4>&copy; Dan Beam, 2010</h4>

</div>
</div>

<script type="text/javascript" src="domready.js"></script>
<script type="text/javascript" src="xhrs.js"></script>
<script type="text/javascript" src="phpbridge.js"></script>
<script>

	function $( id ){ return document.getElementById( id ); }

	DomReady.ready( function( )
	{
		$pb.load( 'Server', function( )
		{
			var serv = new Server( );

			$( 'doit' ).onclick = function( )
			{
				$( 'results' ).innerHTML = 

					serv.argDump
					(
						1,			// number

						"hey",			// string

						true,			// boolean

						null,			// null

						[ 1, 2, 3 ],		// array

						{ "key" : "val" }	// object
					);

				return false;
			};
		} );

		$( 'clear' ).onclick = function( ){ $( 'results' ).innerHTML = ''; return false; };

		// show source highlighting
		sh_highlightDocument( );
	} );

</script>
</body>
</html>
