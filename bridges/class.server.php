<?php

	class Server
	{
		public function uptime( ){ return `uptime`; }
		public function argDump( ){ return print_r( $_POST, true ); }
		private function dontshowme( ){ return `cat /etc/passwd`; }
	}

?>
