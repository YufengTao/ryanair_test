<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class CheapFlights extends CI_Controller {

	public function index()
	{
		$from 			= isset($_GET['from']) ? $_GET['from'] : '';
		$to 			= isset($_GET['to']) ? $_GET['to'] : '';
		$start_date 	= isset($_GET['start_date']) ? $_GET['start_date'] : '';
		$end_date 		= isset($_GET['end_date']) ? $_GET['end_date'] : '';
		$max_price 		= isset($_GET['max_price']) ? $_GET['max_price'] : '';

		echo file_get_contents("http://ryanair-test.herokuapp.com/api/cheap-flights/$from/$to/$start_date/$end_date/$max_price");
	}

}

/* End of file welcome.php */
/* Location: ./application/controllers/welcome.php */